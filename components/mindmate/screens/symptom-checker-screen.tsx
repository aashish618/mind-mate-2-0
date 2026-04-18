"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useMindMateStore } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Language config
// ---------------------------------------------------------------------------
type Language = {
  code: string
  label: string
  nativeLabel: string
  srLang: string // BCP-47 for SpeechRecognition
  placeholder: string
  listenPrompt: string
  triageLabels: { urgent: string; moderate: string; mild: string }
}

const LANGUAGES: Language[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    srLang: "en-IN",
    placeholder: "Describe your symptoms here, or tap the mic to speak…",
    listenPrompt: "Listening… speak your symptoms",
    triageLabels: { urgent: "Seek care urgently", moderate: "Visit a doctor soon", mild: "Rest & monitor" },
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    srLang: "hi-IN",
    placeholder: "यहाँ अपने लक्षण बताएं, या माइक दबाएं…",
    listenPrompt: "सुन रहे हैं… अपने लक्षण बोलें",
    triageLabels: { urgent: "तुरंत डॉक्टर के पास जाएं", moderate: "जल्द डॉक्टर को दिखाएं", mild: "आराम करें और देखें" },
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    srLang: "bn-IN",
    placeholder: "এখানে আপনার লক্ষণ বর্ণনা করুন বা মাইক্রোফোন চাপুন…",
    listenPrompt: "শুনছি… আপনার লক্ষণ বলুন",
    triageLabels: { urgent: "এখনই ডাক্তারের কাছে যান", moderate: "শীঘ্রই ডাক্তার দেখান", mild: "বিশ্রাম নিন ও পর্যবেক্ষণ করুন" },
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    srLang: "ta-IN",
    placeholder: "இங்கே உங்கள் அறிகுறிகளை விவரிக்கவும் அல்லது மைக்கை அழுத்தவும்…",
    listenPrompt: "கேட்கிறோம்… உங்கள் அறிகுறிகளைச் சொல்லுங்கள்",
    triageLabels: { urgent: "உடனடியாக மருத்துவரை பாருங்கள்", moderate: "விரைவில் மருத்துவரை சந்தியுங்கள்", mild: "ஓய்வு எடுத்து கவனியுங்கள்" },
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    srLang: "te-IN",
    placeholder: "ఇక్కడ మీ లక్షణాలు వివరించండి లేదా మైక్ నొక్కండి…",
    listenPrompt: "వింటున్నాము… మీ లక్షణాలు చెప్పండి",
    triageLabels: { urgent: "వెంటనే వైద్యుడిని చూడండి", moderate: "త్వరగా డాక్టర్‌ను కలవండి", mild: "విశ్రాంతి తీసుకోండి & గమనించండి" },
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    srLang: "mr-IN",
    placeholder: "येथे आपली लक्षणे सांगा किंवा मायक्रोफोन दाबा…",
    listenPrompt: "ऐकत आहोत… आपली लक्षणे सांगा",
    triageLabels: { urgent: "लगेच डॉक्टरकडे जा", moderate: "लवकरच डॉक्टरला भेट द्या", mild: "आराम करा व पाहा" },
  },
]

// ---------------------------------------------------------------------------
// Symptom knowledge base (keyword → condition mapping)
// Keywords cover English + romanised Hindi + common transliterations
// ---------------------------------------------------------------------------
type TriageLevel = "urgent" | "moderate" | "mild"

type SymptomMatch = {
  condition: string
  conditionHi: string // Hindi name
  description: string
  descriptionHi: string
  triage: TriageLevel
  actions: string[]
  actionsHi: string[]
  doNotDo: string[]
  doNotDoHi: string[]
  keywords: string[]
}

const SYMPTOM_DB: SymptomMatch[] = [
  {
    condition: "Possible Chest Pain / Heart Issue",
    conditionHi: "सीने में दर्द / दिल की समस्या",
    description: "Chest pain with tightness, pressure, or spreading to the arm or jaw can indicate a cardiac event.",
    descriptionHi: "सीने में दर्द जो बाहों या जबड़े तक फैले, दिल का दौरा हो सकता है।",
    triage: "urgent",
    actions: ["Call emergency services (112) immediately", "Sit or lie down calmly", "Do not eat or drink anything", "Loosen tight clothing"],
    actionsHi: ["तुरंत 112 पर कॉल करें", "शांत होकर बैठें या लेटें", "कुछ खाएं-पिएं नहीं", "कपड़े ढीले करें"],
    doNotDo: ["Do not drive yourself", "Do not ignore and wait"],
    doNotDoHi: ["खुद गाड़ी न चलाएं", "नजरअंदाज न करें"],
    keywords: ["chest pain", "chest tightness", "heart", "seene mein dard", "seene dard", "dil dard", "saans nahi", "left arm pain", "jaw pain", "pressure chest"],
  },
  {
    condition: "High Fever",
    conditionHi: "तेज बुखार",
    description: "Temperature above 103°F (39.4°C) that does not reduce with basic medication may need medical attention.",
    descriptionHi: "103°F से अधिक बुखार जो दवा से कम नहीं हो रहा, तुरंत ध्यान देने योग्य है।",
    triage: "moderate",
    actions: ["Take paracetamol (Crocin) as directed", "Stay hydrated — drink ORS, water, or coconut water", "Use a damp cloth on forehead", "See a doctor if fever persists beyond 2 days"],
    actionsHi: ["पैरासिटामोल (क्रोसिन) लें", "ORS, पानी, नारियल पानी पिएं", "माथे पर गीला कपड़ा रखें", "2 दिन से अधिक बुखार रहे तो डॉक्टर दिखाएं"],
    doNotDo: ["Do not use aspirin for children under 18", "Do not over-bundle with blankets"],
    doNotDoHi: ["18 साल से कम बच्चों को एस्पिरिन न दें", "बहुत अधिक कंबल न लपेटें"],
    keywords: ["fever", "bukhar", "bukhaar", "temperature", "garmi", "body heat", "tez bukhar", "kaamp", "thakaan", "chills", "sweating", "pasin"],
  },
  {
    condition: "Breathlessness / Difficulty Breathing",
    conditionHi: "सांस लेने में तकलीफ",
    description: "Sudden difficulty breathing, wheezing, or inability to speak in full sentences requires urgent care.",
    descriptionHi: "अचानक सांस लेने में दिक्कत, सीटी की आवाज या पूरे वाक्य न बोल पाना, तुरंत ध्यान जरूरी है।",
    triage: "urgent",
    actions: ["Call 112 immediately", "Sit upright, lean slightly forward", "Use inhaler if prescribed", "Open windows for fresh air"],
    actionsHi: ["तुरंत 112 पर कॉल करें", "सीधे बैठें, थोड़ा आगे झुकें", "इनहेलर हो तो लें", "खिड़की खोलें"],
    doNotDo: ["Do not lie flat", "Do not panic — try to breathe slowly"],
    doNotDoHi: ["लेटें नहीं", "घबराएं नहीं — धीरे-धीरे सांस लें"],
    keywords: ["breathless", "saans", "breathing", "inhale", "exhale", "saans nahi", "dam ghutna", "wheezing", "seeti", "chest tight", "asthma", "difficulty breathing"],
  },
  {
    condition: "Headache / Migraine",
    conditionHi: "सिरदर्द / माइग्रेन",
    description: "Recurring or sudden severe headache, especially with light sensitivity or nausea.",
    descriptionHi: "बार-बार या अचानक तेज सिरदर्द, खासकर रोशनी से परेशानी या उल्टी के साथ।",
    triage: "mild",
    actions: ["Rest in a quiet, dark room", "Stay hydrated", "Take paracetamol if needed", "Apply cold or warm compress"],
    actionsHi: ["शांत, अंधेरे कमरे में आराम करें", "पानी पिएं", "जरूरत हो तो पैरासिटामोल लें", "माथे पर ठंडा या गर्म सेंक करें"],
    doNotDo: ["Do not stare at screens", "Do not skip meals"],
    doNotDoHi: ["स्क्रीन मत देखें", "खाना मत छोड़ें"],
    keywords: ["headache", "sir dard", "sirdard", "migraine", "head pain", "sir mein dard", "throbbing", "head throbbing", "nausea headache"],
  },
  {
    condition: "Stomach Pain / Abdominal Discomfort",
    conditionHi: "पेट दर्द",
    description: "Pain or cramps in the abdomen, with or without nausea, vomiting, or loose stools.",
    descriptionHi: "पेट में दर्द या ऐंठन, उल्टी या दस्त के साथ या बिना।",
    triage: "mild",
    actions: ["Avoid spicy and oily food", "Drink ORS or plain water", "Apply warm compress on abdomen", "See doctor if pain is severe or lasts more than 2 days"],
    actionsHi: ["मसालेदार और तेल वाला खाना बंद करें", "ORS या सादा पानी पिएं", "पेट पर गर्म सेंक करें", "दर्द तेज हो या 2 दिन से ज्यादा रहे तो डॉक्टर दिखाएं"],
    doNotDo: ["Do not take strong painkillers without a prescription", "Do not eat heavy meals"],
    doNotDoHi: ["बिना प्रिस्क्रिप्शन के तेज दर्दनिवारक न लें", "भारी खाना न खाएं"],
    keywords: ["stomach", "pet dard", "pet mein dard", "abdomen", "belly", "ulti", "vomiting", "loose motion", "diarrhea", "dast", "nausea", "cramps", "gas", "acidity", "acid"],
  },
  {
    condition: "Cold / Cough / Sore Throat",
    conditionHi: "जुकाम / खांसी / गला दर्द",
    description: "Common upper respiratory symptoms including runny nose, sneezing, mild cough, and sore throat.",
    descriptionHi: "सामान्य सर्दी-जुकाम — बहती नाक, छींकें, हल्की खांसी और गले में खराश।",
    triage: "mild",
    actions: ["Gargle with warm salt water twice a day", "Drink warm fluids — turmeric milk, ginger tea", "Rest and avoid cold drinks", "Steam inhalation helps"],
    actionsHi: ["दिन में दो बार गर्म नमक पानी से गरारे करें", "हल्दी वाला दूध, अदरक की चाय पिएं", "आराम करें, ठंडे पेय से बचें", "भाप लें"],
    doNotDo: ["Do not take antibiotics without a prescription", "Do not share utensils"],
    doNotDoHi: ["बिना नुस्खे के एंटीबायोटिक न लें", "बर्तन न बांटें"],
    keywords: ["cold", "cough", "sore throat", "jukam", "zukam", "khansi", "khasi", "runny nose", "naak behna", "gala dard", "sneezing", "chheenk", "nasal", "congestion", "kaph"],
  },
  {
    condition: "Joint / Muscle Pain",
    conditionHi: "जोड़ों / मांसपेशियों में दर्द",
    description: "Pain, stiffness, or swelling in joints or muscles, often from overuse, arthritis, or viral illness.",
    descriptionHi: "जोड़ों या मांसपेशियों में दर्द, अकड़न या सूजन।",
    triage: "mild",
    actions: ["Rest the affected area", "Apply ice pack for acute injury, warm pack for chronic pain", "Gentle stretching after 48 hours", "See doctor if pain limits daily activity"],
    actionsHi: ["प्रभावित हिस्से को आराम दें", "ताजा चोट पर बर्फ, पुराने दर्द पर गर्म सेंक", "48 घंटे बाद हल्की स्ट्रेचिंग करें", "दर्द काम में रुकावट डाले तो डॉक्टर दिखाएं"],
    doNotDo: ["Do not overexert the joint", "Do not self-medicate with steroids"],
    doNotDoHi: ["जोड़ पर ज्यादा जोर न डालें", "खुद से स्टेरॉयड न लें"],
    keywords: ["joint pain", "jodo mein dard", "muscle pain", "body ache", "badan dard", "swelling", "soojan", "arthritis", "back pain", "kamar dard", "knee pain", "ghutna dard", "stiffness"],
  },
  {
    condition: "Dizziness / Fainting",
    conditionHi: "चक्कर आना / बेहोशी",
    description: "Lightheadedness, spinning sensation, or sudden fainting, possibly from low blood pressure, dehydration, or blood sugar drop.",
    descriptionHi: "सिर घूमना, चक्कर आना या अचानक बेहोश होना, जो निम्न रक्तचाप, डिहाइड्रेशन या शुगर गिरने से हो सकता है।",
    triage: "moderate",
    actions: ["Sit or lie down immediately", "Drink glucose water or juice if diabetic", "Eat something if you haven't in a while", "See a doctor to rule out blood pressure issues"],
    actionsHi: ["तुरंत बैठ जाएं या लेट जाएं", "डायबिटीज हो तो ग्लूकोज पानी या जूस पिएं", "काफी देर से कुछ न खाया हो तो खाएं", "ब्लड प्रेशर की जांच के लिए डॉक्टर दिखाएं"],
    doNotDo: ["Do not drive or operate machinery", "Do not get up suddenly"],
    doNotDoHi: ["गाड़ी न चलाएं", "अचानक न उठें"],
    keywords: ["dizzy", "dizziness", "chakkar", "faint", "behosh", "vertigo", "lightheaded", "sir ghoomna", "black out", "blackout", "spinning"],
  },
  {
    condition: "Eye Irritation / Redness",
    conditionHi: "आंखों में जलन / लालिमा",
    description: "Red, watery, or itchy eyes, possibly from infection, allergy, or dust exposure.",
    descriptionHi: "आंखों में लालिमा, खुजली या पानी आना, संक्रमण, एलर्जी या धूल से हो सकता है।",
    triage: "mild",
    actions: ["Rinse eyes with clean water", "Avoid rubbing eyes", "Use lubricant eye drops", "See doctor if discharge or vision is affected"],
    actionsHi: ["साफ पानी से आंखें धोएं", "आंखें मलें नहीं", "लुब्रिकेंट ड्रॉप्स डालें", "पस या धुंधलापन हो तो डॉक्टर दिखाएं"],
    doNotDo: ["Do not share eye drops or towels", "Do not wear contact lenses during irritation"],
    doNotDoHi: ["आई ड्रॉप या तौलिया शेयर न करें", "जलन के दौरान कॉन्टैक्ट लेंस न पहनें"],
    keywords: ["eye", "aankh", "eyes", "red eye", "lal aankh", "itchy eye", "watery eye", "discharge", "conjunctivitis", "pink eye", "irritation", "aankhon mein dard"],
  },
  {
    condition: "Skin Rash / Allergy",
    conditionHi: "त्वचा पर दाने / एलर्जी",
    description: "Redness, itching, hives, or rash on skin, possibly from food, medicine, insect bite, or contact.",
    descriptionHi: "त्वचा पर लालिमा, खुजली, पित्ती या दाने — खाने, दवा, कीड़े के काटने से हो सकते हैं।",
    triage: "mild",
    actions: ["Wash the area with mild soap and water", "Apply calamine lotion or cold compress", "Avoid scratching", "Take antihistamine if prescribed"],
    actionsHi: ["हल्के साबुन और पानी से धोएं", "कैलामाइन लोशन या ठंडी सेंक लगाएं", "खुजलाएं नहीं", "डॉक्टर ने लिखी हो तो एंटीहिस्टामाइन लें"],
    doNotDo: ["Do not apply toothpaste or home remedies", "Do not use steroid cream without prescription"],
    doNotDoHi: ["टूथपेस्ट या घरेलू नुस्खे न लगाएं", "बिना नुस्खे के स्टेरॉयड क्रीम न लगाएं"],
    keywords: ["rash", "skin", "itching", "khujli", "allergy", "allergy", "hives", "redness", "daane", "pitti", "insect bite", "keede ka kaatna", "swollen skin", "eczema"],
  },
]

// ---------------------------------------------------------------------------
// Triage config
// ---------------------------------------------------------------------------
const TRIAGE_CONFIG: Record<TriageLevel, { label: string; color: string; borderColor: string; bgColor: string; icon: string }> = {
  urgent: {
    label: "Seek care urgently",
    color: "text-destructive",
    borderColor: "border-destructive/40",
    bgColor: "bg-destructive/8",
    icon: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  },
  moderate: {
    label: "Visit a doctor soon",
    color: "text-warning-foreground",
    borderColor: "border-warning/40",
    bgColor: "bg-warning/8",
    icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5v6m0 3h.01",
  },
  mild: {
    label: "Rest & monitor at home",
    color: "text-success",
    borderColor: "border-success/40",
    bgColor: "bg-success/8",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
}

// ---------------------------------------------------------------------------
// Symptom analysis engine
// ---------------------------------------------------------------------------
function analyzeSymptoms(text: string): SymptomMatch[] {
  if (!text.trim()) return []
  const lower = text.toLowerCase()
  const results: SymptomMatch[] = []

  for (const symptom of SYMPTOM_DB) {
    const matched = symptom.keywords.some((kw) => lower.includes(kw))
    if (matched) results.push(symptom)
  }

  // Sort: urgent first, then moderate, then mild
  const order: TriageLevel[] = ["urgent", "moderate", "mild"]
  return results.sort((a, b) => order.indexOf(a.triage) - order.indexOf(b.triage))
}

// ---------------------------------------------------------------------------
// Types for Web Speech API (not in default TS lib)
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
  interface SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    start(): void
    stop(): void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SymptomCheckerScreen() {
  const { navigateTo } = useMindMateStore()
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [results, setResults] = useState<SymptomMatch[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showHindi, setShowHindi] = useState(selectedLang.code === "hi")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    setVoiceSupported(supported)
  }, [])

  useEffect(() => {
    setShowHindi(selectedLang.code === "hi")
  }, [selectedLang])

  const startListening = useCallback(() => {
    if (!voiceSupported) return
    setVoiceError(null)

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = selectedLang.srLang
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ""
      setInputText((prev) => (prev ? prev + " " + transcript : transcript))
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === "not-allowed") {
        setVoiceError("Microphone access denied. Please allow microphone permission in your browser.")
      } else if (event.error === "no-speech") {
        setVoiceError("No speech detected. Please try again.")
      } else {
        setVoiceError("Voice input failed. Please type your symptoms instead.")
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [voiceSupported, selectedLang])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const handleCheck = () => {
    const matched = analyzeSymptoms(inputText)
    setResults(matched)
    setShowResults(true)
  }

  const handleReset = () => {
    setInputText("")
    setResults([])
    setShowResults(false)
    setVoiceError(null)
  }

  const topTriage: TriageLevel | null =
    results.length > 0 ? results[0].triage : null
  const triageConf = topTriage ? TRIAGE_CONFIG[topTriage] : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 bg-card border-b border-border sticky top-0 z-50">
        <button
          onClick={() => navigateTo("dashboard")}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors shrink-0"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground leading-tight">Symptom Checker</h1>
          <p className="text-xs text-muted-foreground">Speak or type in your language</p>
        </div>
        {/* Hindi bilingual toggle */}
        <button
          onClick={() => setShowHindi((v) => !v)}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
            showHindi
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {showHindi ? "EN" : "हिंदी"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-5">

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-warning/8 border border-warning/30 rounded-2xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-warning-foreground shrink-0 mt-0.5">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs text-warning-foreground leading-relaxed">
            {showHindi
              ? "यह एक AI सहायक उपकरण है, डॉक्टर का विकल्प नहीं। आपात स्थिति में 112 पर कॉल करें।"
              : "This is an AI guidance tool, not a substitute for a doctor. In emergencies, call 112."}
          </p>
        </div>

        {/* Language selector */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {showHindi ? "भाषा चुनें" : "Select Language"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selectedLang.code === lang.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                )}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>

        {!showResults ? (
          /* ---- INPUT PANEL ---- */
          <>
            {/* Mic button */}
            {voiceSupported && (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "relative w-24 h-24 rounded-full flex items-center justify-center transition-all",
                    isListening
                      ? "bg-destructive text-white shadow-lg scale-105"
                      : "bg-primary text-primary-foreground shadow-md hover:scale-105"
                  )}
                  aria-label={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                  )}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 10v2a7 7 0 0014 0v-2M12 19v3M9 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <p className="text-sm text-muted-foreground text-center">
                  {isListening
                    ? selectedLang.listenPrompt
                    : (showHindi ? "माइक दबाएं और बोलें" : "Tap to speak")}
                </p>
              </div>
            )}

            {voiceError && (
              <p className="text-xs text-destructive text-center bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                {voiceError}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{showHindi ? "या टाइप करें" : "or type below"}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Text area */}
            <div className="flex flex-col gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedLang.placeholder}
                rows={4}
                className="w-full p-4 bg-card border border-border rounded-2xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
              />
              {inputText && (
                <button
                  onClick={() => setInputText("")}
                  className="self-end text-xs text-muted-foreground hover:text-foreground"
                >
                  {showHindi ? "साफ करें" : "Clear"}
                </button>
              )}
            </div>

            {/* Quick symptom chips */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {showHindi ? "सामान्य लक्षण" : "Common symptoms — tap to add"}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { en: "Fever", hi: "बुखार" },
                  { en: "Headache", hi: "सिरदर्द" },
                  { en: "Cough", hi: "खांसी" },
                  { en: "Stomach pain", hi: "पेट दर्द" },
                  { en: "Dizziness", hi: "चक्कर" },
                  { en: "Chest pain", hi: "सीने दर्द" },
                  { en: "Breathlessness", hi: "सांस लेने में दिक्कत" },
                  { en: "Joint pain", hi: "जोड़ों में दर्द" },
                ].map((chip) => (
                  <button
                    key={chip.en}
                    onClick={() =>
                      setInputText((prev) =>
                        prev ? prev + ", " + chip.en : chip.en
                      )
                    }
                    className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 rounded-full text-xs text-muted-foreground transition-colors"
                  >
                    {showHindi ? chip.hi : chip.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyse button */}
            <button
              onClick={handleCheck}
              disabled={!inputText.trim()}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {showHindi ? "लक्षण जांचें" : "Check My Symptoms"}
            </button>
          </>
        ) : (
          /* ---- RESULTS PANEL ---- */
          <>
            {/* Overall triage banner */}
            {triageConf && topTriage && (
              <div className={cn("rounded-2xl border px-4 py-4 flex items-center gap-3", triageConf.borderColor, triageConf.bgColor)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cn("shrink-0", triageConf.color)}>
                  <path d={triageConf.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className={cn("font-semibold text-sm", triageConf.color)}>
                    {selectedLang.triageLabels[topTriage]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {topTriage === "urgent"
                      ? (showHindi ? "तुरंत 112 या नजदीकी अस्पताल जाएं" : "Call 112 or go to the nearest hospital now")
                      : topTriage === "moderate"
                      ? (showHindi ? "24–48 घंटे में डॉक्टर दिखाएं" : "See a doctor within 24–48 hours")
                      : (showHindi ? "घर पर आराम करें, बिगड़े तो डॉक्टर दिखाएं" : "Rest at home; see a doctor if it worsens")}
                  </p>
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M21 21l-4.35-4.35M11 8v3m0 3h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-semibold text-foreground text-sm">No matching symptoms found</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {showHindi
                    ? "कृपया लक्षण अधिक विस्तार से बताएं, जैसे \"सिरदर्द के साथ बुखार\""
                    : "Try describing symptoms in more detail, e.g. \"fever with headache and body ache\""}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((result) => {
                  const conf = TRIAGE_CONFIG[result.triage]
                  return (
                    <div
                      key={result.condition}
                      className={cn("bg-card rounded-2xl border overflow-hidden", conf.borderColor)}
                    >
                      {/* Card header */}
                      <div className={cn("px-4 py-3 flex items-center gap-3", conf.bgColor)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cn("shrink-0", conf.color)}>
                          <path d={conf.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="flex-1">
                          <p className={cn("font-semibold text-sm", conf.color)}>
                            {showHindi ? result.conditionHi : result.condition}
                          </p>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", conf.bgColor, conf.color, "border", conf.borderColor)}>
                            {selectedLang.triageLabels[result.triage]}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 py-3 flex flex-col gap-3">
                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {showHindi ? result.descriptionHi : result.description}
                        </p>

                        {/* Do this */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1.5">
                            {showHindi ? "क्या करें" : "What to do"}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {(showHindi ? result.actionsHi : result.actions).map((action, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Do NOT */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1.5">
                            {showHindi ? "क्या न करें" : "Do NOT"}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {(showHindi ? result.doNotDoHi : result.doNotDo).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Emergency strip */}
            <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-2xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-destructive shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <p className="text-xs text-destructive font-medium flex-1">
                {showHindi ? "आपात स्थिति में: 112 (भारत) पर कॉल करें" : "Emergency: Call 112 (India)"}
              </p>
            </div>

            {/* Entered text recap */}
            <div className="p-3 bg-muted/40 rounded-xl">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{showHindi ? "आपने बताया: " : "You described: "}</span>
                {inputText}
              </p>
            </div>

            {/* Check again */}
            <button
              onClick={handleReset}
              className="w-full py-4 bg-muted text-foreground rounded-2xl font-semibold text-sm hover:bg-muted/70 transition-colors"
            >
              {showHindi ? "दोबारा जांचें" : "Check again"}
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
