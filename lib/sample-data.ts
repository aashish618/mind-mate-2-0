import { Medicine, Caregiver } from './medicine-store'

// Medicine categories
export const medicineCategories = {
  cardiovascular: { name: "Heart & Blood Pressure", icon: "heart", color: "bg-red-100 text-red-700" },
  diabetes: { name: "Diabetes", icon: "droplet", color: "bg-blue-100 text-blue-700" },
  pain: { name: "Pain & Fever", icon: "thermometer", color: "bg-orange-100 text-orange-700" },
  antibiotics: { name: "Antibiotics", icon: "shield", color: "bg-green-100 text-green-700" },
  gastric: { name: "Gastric & Acidity", icon: "apple", color: "bg-yellow-100 text-yellow-700" },
  respiratory: { name: "Respiratory & Allergies", icon: "wind", color: "bg-cyan-100 text-cyan-700" },
  vitamins: { name: "Vitamins & Supplements", icon: "sun", color: "bg-amber-100 text-amber-700" },
  thyroid: { name: "Thyroid", icon: "activity", color: "bg-purple-100 text-purple-700" },
  mental: { name: "Mental Health", icon: "brain", color: "bg-indigo-100 text-indigo-700" },
  steroids: { name: "Steroids", icon: "zap", color: "bg-pink-100 text-pink-700" },
  urinary: { name: "Urinary & Kidney", icon: "droplets", color: "bg-teal-100 text-teal-700" },
  nerve: { name: "Nerve Pain", icon: "sparkles", color: "bg-violet-100 text-violet-700" },
} as const

export type MedicineCategory = keyof typeof medicineCategories

export interface SampleMedicine extends Omit<Medicine, 'id'> {
  category: MedicineCategory
}

// Top 50 commonly used medicines in India with proper dosages, timings and categories
export const sampleMedicines: SampleMedicine[] = [
  // ==================== CARDIOVASCULAR & BLOOD PRESSURE (9) ====================
  { category: "cardiovascular", name: "Amlodipine", dosage: "5mg", timing: ["morning"], instructions: "Take with or without food. For high blood pressure.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Atenolol", dosage: "50mg", timing: ["morning"], instructions: "Take on empty stomach. For blood pressure and heart rate.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Losartan", dosage: "50mg", timing: ["morning"], instructions: "Can be taken with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Telmisartan", dosage: "40mg", timing: ["morning"], instructions: "Take at the same time daily for BP control.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Metoprolol", dosage: "25mg", timing: ["morning", "evening"], instructions: "Take with food. Do not stop suddenly.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Ecosprin (Aspirin)", dosage: "75mg", timing: ["morning"], instructions: "Take after breakfast. Blood thinner.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Clopidogrel", dosage: "75mg", timing: ["morning"], instructions: "Take with or without food. Blood thinner.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Atorvastatin", dosage: "10mg", timing: ["night"], instructions: "Take at bedtime. For cholesterol control.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "cardiovascular", name: "Rosuvastatin", dosage: "10mg", timing: ["night"], instructions: "Take at night. Avoid grapefruit.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== DIABETES (5) ====================
  { category: "diabetes", name: "Metformin", dosage: "500mg", timing: ["morning", "evening"], instructions: "Take with meals to reduce stomach upset.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "diabetes", name: "Glimepiride", dosage: "1mg", timing: ["morning"], instructions: "Take with breakfast. Monitor blood sugar.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "diabetes", name: "Sitagliptin", dosage: "100mg", timing: ["morning"], instructions: "Can be taken with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "diabetes", name: "Gliclazide", dosage: "40mg", timing: ["morning"], instructions: "Take with breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "diabetes", name: "Pioglitazone", dosage: "15mg", timing: ["morning"], instructions: "Take with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== PAIN & FEVER (5) ====================
  { category: "pain", name: "Paracetamol (Crocin)", dosage: "500mg", timing: ["morning", "afternoon", "evening"], instructions: "Take after food. Max 4 doses per day.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { category: "pain", name: "Ibuprofen (Brufen)", dosage: "400mg", timing: ["morning", "evening"], instructions: "Take after food. Do not take on empty stomach.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "pain", name: "Diclofenac", dosage: "50mg", timing: ["morning", "evening"], instructions: "Take with food. For pain and inflammation.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "pain", name: "Aceclofenac", dosage: "100mg", timing: ["morning", "evening"], instructions: "Take after meals.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "pain", name: "Dolo", dosage: "650mg", timing: ["morning", "evening"], instructions: "Take after food for fever/pain.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== ANTIBIOTICS (5) ====================
  { category: "antibiotics", name: "Amoxicillin", dosage: "500mg", timing: ["morning", "afternoon", "evening"], instructions: "Complete the full course. Take with water.", quantity: 21, totalQuantity: 21, startDate: new Date().toISOString().split('T')[0] },
  { category: "antibiotics", name: "Azithromycin", dosage: "500mg", timing: ["morning"], instructions: "Take on empty stomach. 5-day course.", quantity: 5, totalQuantity: 5, startDate: new Date().toISOString().split('T')[0] },
  { category: "antibiotics", name: "Ciprofloxacin", dosage: "500mg", timing: ["morning", "evening"], instructions: "Avoid dairy products. Stay hydrated.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  { category: "antibiotics", name: "Cefixime", dosage: "200mg", timing: ["morning", "evening"], instructions: "Take with or without food.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  { category: "antibiotics", name: "Ofloxacin", dosage: "200mg", timing: ["morning", "evening"], instructions: "Avoid antacids. Take 2 hours apart.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== GASTRIC & ACIDITY (5) ====================
  { category: "gastric", name: "Pantoprazole (Pan)", dosage: "40mg", timing: ["morning"], instructions: "Take 30 min before breakfast on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "gastric", name: "Omeprazole", dosage: "20mg", timing: ["morning"], instructions: "Take before breakfast on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "gastric", name: "Ranitidine", dosage: "150mg", timing: ["morning", "night"], instructions: "Take 30 min before meals.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "gastric", name: "Domperidone", dosage: "10mg", timing: ["morning", "afternoon", "evening"], instructions: "Take 15-30 min before meals. For nausea.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { category: "gastric", name: "Rabeprazole", dosage: "20mg", timing: ["morning"], instructions: "Take before food on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== RESPIRATORY & ALLERGIES (5) ====================
  { category: "respiratory", name: "Cetirizine", dosage: "10mg", timing: ["night"], instructions: "May cause drowsiness. For allergies.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "respiratory", name: "Levocetirizine", dosage: "5mg", timing: ["night"], instructions: "Take at bedtime. Less drowsiness than cetirizine.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "respiratory", name: "Montelukast", dosage: "10mg", timing: ["night"], instructions: "Take at bedtime. For asthma and allergies.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "respiratory", name: "Salbutamol", dosage: "4mg", timing: ["morning", "evening"], instructions: "For breathing problems. Use as needed.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "respiratory", name: "Dextromethorphan (Benadryl)", dosage: "10ml", timing: ["morning", "afternoon", "night"], instructions: "For dry cough. May cause drowsiness.", quantity: 21, totalQuantity: 21, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== VITAMINS & SUPPLEMENTS (5) ====================
  { category: "vitamins", name: "Vitamin D3", dosage: "60000IU", timing: ["morning"], instructions: "Take weekly with fatty meal.", quantity: 8, totalQuantity: 8, startDate: new Date().toISOString().split('T')[0] },
  { category: "vitamins", name: "Calcium + Vitamin D (Shelcal)", dosage: "500mg", timing: ["morning", "evening"], instructions: "Take with meals. Good for bones.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "vitamins", name: "B-Complex (Becosules)", dosage: "1 cap", timing: ["morning"], instructions: "Take after breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "vitamins", name: "Iron + Folic Acid (Autrin)", dosage: "1 cap", timing: ["morning"], instructions: "Take on empty stomach with vitamin C.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "vitamins", name: "Multivitamin (Zincovit)", dosage: "1 tab", timing: ["morning"], instructions: "Take with breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== THYROID (2) ====================
  { category: "thyroid", name: "Levothyroxine (Thyronorm)", dosage: "50mcg", timing: ["morning"], instructions: "Take on empty stomach 30 min before food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "thyroid", name: "Methimazole (Neomercazole)", dosage: "5mg", timing: ["morning"], instructions: "Take at same time daily. For hyperthyroid.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== MENTAL HEALTH (3) ====================
  { category: "mental", name: "Alprazolam", dosage: "0.25mg", timing: ["night"], instructions: "Take at bedtime. Do not stop suddenly.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "mental", name: "Escitalopram", dosage: "10mg", timing: ["morning"], instructions: "Take at same time daily. For anxiety/depression.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "mental", name: "Clonazepam", dosage: "0.5mg", timing: ["night"], instructions: "Take at bedtime. Avoid alcohol.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== STEROIDS (2) ====================
  { category: "steroids", name: "Prednisolone", dosage: "10mg", timing: ["morning"], instructions: "Take with food. Do not stop suddenly.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "steroids", name: "Deflazacort", dosage: "6mg", timing: ["morning"], instructions: "Take after breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== URINARY & KIDNEY (2) ====================
  { category: "urinary", name: "Tamsulosin", dosage: "0.4mg", timing: ["night"], instructions: "Take after dinner. For prostate issues.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { category: "urinary", name: "Nitrofurantoin", dosage: "100mg", timing: ["morning", "evening"], instructions: "Take with food. For UTI.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  
  // ==================== NERVE PAIN (3) ====================
  { category: "nerve", name: "Gabapentin", dosage: "300mg", timing: ["morning", "evening", "night"], instructions: "For nerve pain. Do not stop suddenly.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { category: "nerve", name: "Pregabalin", dosage: "75mg", timing: ["morning", "night"], instructions: "For nerve pain. May cause dizziness.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { category: "nerve", name: "Ondansetron", dosage: "4mg", timing: ["morning", "evening"], instructions: "Take 30 min before chemotherapy/surgery. For nausea.", quantity: 20, totalQuantity: 20, startDate: new Date().toISOString().split('T')[0] },
]

// Emergency contact categories
export const caregiverCategories = {
  emergency: { name: "Emergency Services", icon: "siren", color: "bg-red-500" },
  hospital: { name: "Hospitals", icon: "building-2", color: "bg-blue-500" },
  helpline: { name: "Helplines", icon: "phone", color: "bg-green-500" },
  family: { name: "Family Members", icon: "users", color: "bg-purple-500" },
} as const

// Emergency and healthcare helpline numbers in India - segregated by category
export const defaultCaregivers: (Omit<Caregiver, 'id'> & { category: string })[] = [
  // ==================== EMERGENCY SERVICES ====================
  { category: "emergency", name: "Emergency Ambulance", phone: "102", relationship: "Emergency" },
  { category: "emergency", name: "National Emergency Number", phone: "112", relationship: "Emergency" },
  { category: "emergency", name: "Police", phone: "100", relationship: "Emergency" },
  { category: "emergency", name: "Fire Brigade", phone: "101", relationship: "Emergency" },
  { category: "emergency", name: "Women Helpline", phone: "181", relationship: "Emergency" },
  { category: "emergency", name: "Child Helpline", phone: "1098", relationship: "Emergency" },
  { category: "emergency", name: "Poison Control", phone: "1800-116-117", relationship: "Emergency" },
  
  // ==================== HOSPITALS ====================
  { category: "hospital", name: "AIIMS Delhi", phone: "011-26588500", relationship: "Hospital" },
  { category: "hospital", name: "Apollo Hospitals (24x7)", phone: "1860-500-1066", relationship: "Hospital" },
  { category: "hospital", name: "Fortis Hospitals (24x7)", phone: "1800-102-2244", relationship: "Hospital" },
  { category: "hospital", name: "Max Healthcare (24x7)", phone: "011-26515050", relationship: "Hospital" },
  { category: "hospital", name: "Medanta Hospital (24x7)", phone: "0124-4141414", relationship: "Hospital" },
  { category: "hospital", name: "Manipal Hospitals", phone: "1800-102-9999", relationship: "Hospital" },
  { category: "hospital", name: "Narayana Health", phone: "1800-102-0070", relationship: "Hospital" },
  
  // ==================== HELPLINES ====================
  { category: "helpline", name: "Health Helpline (NHP)", phone: "1800-180-1104", relationship: "Helpline" },
  { category: "helpline", name: "COVID Helpline", phone: "1075", relationship: "Helpline" },
  { category: "helpline", name: "Mental Health (NIMHANS)", phone: "080-46110007", relationship: "Helpline" },
  { category: "helpline", name: "iCall Mental Health", phone: "9152987821", relationship: "Helpline" },
  { category: "helpline", name: "Vandrevala Foundation", phone: "1860-2662-345", relationship: "Helpline" },
  { category: "helpline", name: "Senior Citizen Helpline", phone: "14567", relationship: "Helpline" },
  { category: "helpline", name: "Blood Bank (NBTC)", phone: "1800-114-770", relationship: "Helpline" },
  { category: "helpline", name: "Eye Donation", phone: "1800-114-770", relationship: "Helpline" },
]

// Get medicines grouped by category
export const getMedicinesByCategory = (medicines: SampleMedicine[]) => {
  const grouped: Record<MedicineCategory, SampleMedicine[]> = {
    cardiovascular: [],
    diabetes: [],
    pain: [],
    antibiotics: [],
    gastric: [],
    respiratory: [],
    vitamins: [],
    thyroid: [],
    mental: [],
    steroids: [],
    urinary: [],
    nerve: [],
  }
  
  medicines.forEach((med) => {
    if (grouped[med.category]) {
      grouped[med.category].push(med)
    }
  })
  
  return grouped
}

// Get caregivers grouped by category
export const getCaregiversByCategory = (caregivers: typeof defaultCaregivers) => {
  const grouped: Record<string, typeof defaultCaregivers> = {
    emergency: [],
    hospital: [],
    helpline: [],
    family: [],
  }
  
  caregivers.forEach((cg) => {
    if (grouped[cg.category]) {
      grouped[cg.category].push(cg)
    }
  })
  
  return grouped
}
