import { Medicine, Caregiver } from './medicine-store'

// Top 50 commonly used medicines in India with proper dosages and timings
export const sampleMedicines: Omit<Medicine, 'id'>[] = [
  // Cardiovascular & Blood Pressure
  { name: "Amlodipine", dosage: "5mg", timing: ["morning"], instructions: "Take with or without food. For high blood pressure.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Atenolol", dosage: "50mg", timing: ["morning"], instructions: "Take on empty stomach. For blood pressure and heart rate.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Losartan", dosage: "50mg", timing: ["morning"], instructions: "Can be taken with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Telmisartan", dosage: "40mg", timing: ["morning"], instructions: "Take at the same time daily for BP control.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Metoprolol", dosage: "25mg", timing: ["morning", "evening"], instructions: "Take with food. Do not stop suddenly.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Ecosprin (Aspirin)", dosage: "75mg", timing: ["morning"], instructions: "Take after breakfast. Blood thinner.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Clopidogrel", dosage: "75mg", timing: ["morning"], instructions: "Take with or without food. Blood thinner.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Atorvastatin", dosage: "10mg", timing: ["night"], instructions: "Take at bedtime. For cholesterol control.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Rosuvastatin", dosage: "10mg", timing: ["night"], instructions: "Take at night. Avoid grapefruit.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Diabetes
  { name: "Metformin", dosage: "500mg", timing: ["morning", "evening"], instructions: "Take with meals to reduce stomach upset.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Glimepiride", dosage: "1mg", timing: ["morning"], instructions: "Take with breakfast. Monitor blood sugar.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Sitagliptin", dosage: "100mg", timing: ["morning"], instructions: "Can be taken with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Gliclazide", dosage: "40mg", timing: ["morning"], instructions: "Take with breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Pioglitazone", dosage: "15mg", timing: ["morning"], instructions: "Take with or without food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Pain & Fever
  { name: "Paracetamol (Crocin)", dosage: "500mg", timing: ["morning", "afternoon", "evening"], instructions: "Take after food. Max 4 doses per day.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { name: "Ibuprofen (Brufen)", dosage: "400mg", timing: ["morning", "evening"], instructions: "Take after food. Do not take on empty stomach.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Diclofenac", dosage: "50mg", timing: ["morning", "evening"], instructions: "Take with food. For pain and inflammation.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Aceclofenac", dosage: "100mg", timing: ["morning", "evening"], instructions: "Take after meals.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  
  // Antibiotics
  { name: "Amoxicillin", dosage: "500mg", timing: ["morning", "afternoon", "evening"], instructions: "Complete the full course. Take with water.", quantity: 21, totalQuantity: 21, startDate: new Date().toISOString().split('T')[0] },
  { name: "Azithromycin", dosage: "500mg", timing: ["morning"], instructions: "Take on empty stomach. 5-day course.", quantity: 5, totalQuantity: 5, startDate: new Date().toISOString().split('T')[0] },
  { name: "Ciprofloxacin", dosage: "500mg", timing: ["morning", "evening"], instructions: "Avoid dairy products. Stay hydrated.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  { name: "Cefixime", dosage: "200mg", timing: ["morning", "evening"], instructions: "Take with or without food.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  { name: "Ofloxacin", dosage: "200mg", timing: ["morning", "evening"], instructions: "Avoid antacids. Take 2 hours apart.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  
  // Gastric & Acidity
  { name: "Pantoprazole (Pan)", dosage: "40mg", timing: ["morning"], instructions: "Take 30 min before breakfast on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Omeprazole", dosage: "20mg", timing: ["morning"], instructions: "Take before breakfast on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Ranitidine", dosage: "150mg", timing: ["morning", "night"], instructions: "Take 30 min before meals.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Domperidone", dosage: "10mg", timing: ["morning", "afternoon", "evening"], instructions: "Take 15-30 min before meals. For nausea.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { name: "Rabeprazole", dosage: "20mg", timing: ["morning"], instructions: "Take before food on empty stomach.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Respiratory & Allergies
  { name: "Cetirizine", dosage: "10mg", timing: ["night"], instructions: "May cause drowsiness. For allergies.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Levocetirizine", dosage: "5mg", timing: ["night"], instructions: "Take at bedtime. Less drowsiness than cetirizine.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Montelukast", dosage: "10mg", timing: ["night"], instructions: "Take at bedtime. For asthma and allergies.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Salbutamol", dosage: "4mg", timing: ["morning", "evening"], instructions: "For breathing problems. Use as needed.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Dextromethorphan (Benadryl)", dosage: "10ml", timing: ["morning", "afternoon", "night"], instructions: "For dry cough. May cause drowsiness.", quantity: 21, totalQuantity: 21, startDate: new Date().toISOString().split('T')[0] },
  
  // Vitamins & Supplements
  { name: "Vitamin D3", dosage: "60000IU", timing: ["morning"], instructions: "Take weekly with fatty meal.", quantity: 8, totalQuantity: 8, startDate: new Date().toISOString().split('T')[0] },
  { name: "Calcium + Vitamin D (Shelcal)", dosage: "500mg", timing: ["morning", "evening"], instructions: "Take with meals. Good for bones.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "B-Complex (Becosules)", dosage: "1 cap", timing: ["morning"], instructions: "Take after breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Iron + Folic Acid (Autrin)", dosage: "1 cap", timing: ["morning"], instructions: "Take on empty stomach with vitamin C.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Multivitamin (Zincovit)", dosage: "1 tab", timing: ["morning"], instructions: "Take with breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Thyroid
  { name: "Levothyroxine (Thyronorm)", dosage: "50mcg", timing: ["morning"], instructions: "Take on empty stomach 30 min before food.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Mental Health
  { name: "Alprazolam", dosage: "0.25mg", timing: ["night"], instructions: "Take at bedtime. Do not stop suddenly.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Escitalopram", dosage: "10mg", timing: ["morning"], instructions: "Take at same time daily. For anxiety/depression.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Clonazepam", dosage: "0.5mg", timing: ["night"], instructions: "Take at bedtime. Avoid alcohol.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Steroids
  { name: "Prednisolone", dosage: "10mg", timing: ["morning"], instructions: "Take with food. Do not stop suddenly.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Deflazacort", dosage: "6mg", timing: ["morning"], instructions: "Take after breakfast.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  
  // Urinary & Kidney
  { name: "Tamsulosin", dosage: "0.4mg", timing: ["night"], instructions: "Take after dinner. For prostate issues.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
  { name: "Nitrofurantoin", dosage: "100mg", timing: ["morning", "evening"], instructions: "Take with food. For UTI.", quantity: 14, totalQuantity: 14, startDate: new Date().toISOString().split('T')[0] },
  
  // Others
  { name: "Ondansetron", dosage: "4mg", timing: ["morning", "evening"], instructions: "Take 30 min before chemotherapy/surgery. For nausea.", quantity: 20, totalQuantity: 20, startDate: new Date().toISOString().split('T')[0] },
  { name: "Gabapentin", dosage: "300mg", timing: ["morning", "evening", "night"], instructions: "For nerve pain. Do not stop suddenly.", quantity: 90, totalQuantity: 90, startDate: new Date().toISOString().split('T')[0] },
  { name: "Pregabalin", dosage: "75mg", timing: ["morning", "night"], instructions: "For nerve pain. May cause dizziness.", quantity: 60, totalQuantity: 60, startDate: new Date().toISOString().split('T')[0] },
  { name: "Dolo (Paracetamol)", dosage: "650mg", timing: ["morning", "evening"], instructions: "Take after food for fever/pain.", quantity: 30, totalQuantity: 30, startDate: new Date().toISOString().split('T')[0] },
]

// Emergency and healthcare helpline numbers in India
export const defaultCaregivers: Omit<Caregiver, 'id'>[] = [
  { name: "Emergency Ambulance", phone: "102", relationship: "Emergency" },
  { name: "National Emergency", phone: "112", relationship: "Emergency" },
  { name: "AIIMS Delhi", phone: "011-26588500", relationship: "Hospital" },
  { name: "Apollo Hospitals", phone: "1860-500-1066", relationship: "Hospital" },
  { name: "Fortis Hospitals", phone: "1800-102-2244", relationship: "Hospital" },
  { name: "Max Healthcare", phone: "011-26515050", relationship: "Hospital" },
  { name: "Medanta Hospital", phone: "0124-4141414", relationship: "Hospital" },
  { name: "Health Helpline (NHP)", phone: "1800-180-1104", relationship: "Helpline" },
  { name: "Mental Health Helpline (NIMHANS)", phone: "080-46110007", relationship: "Helpline" },
  { name: "Senior Citizen Helpline", phone: "14567", relationship: "Helpline" },
  { name: "Women Helpline", phone: "181", relationship: "Emergency" },
  { name: "Poison Control", phone: "1800-116-117", relationship: "Emergency" },
]

// Medicine categories for filtering
export const medicineCategories = [
  { id: "cardiovascular", name: "Heart & Blood Pressure", icon: "heart" },
  { id: "diabetes", name: "Diabetes", icon: "droplet" },
  { id: "pain", name: "Pain & Fever", icon: "thermometer" },
  { id: "antibiotics", name: "Antibiotics", icon: "pill" },
  { id: "gastric", name: "Gastric & Acidity", icon: "stomach" },
  { id: "respiratory", name: "Respiratory & Allergies", icon: "wind" },
  { id: "vitamins", name: "Vitamins & Supplements", icon: "sun" },
  { id: "thyroid", name: "Thyroid", icon: "activity" },
  { id: "mental", name: "Mental Health", icon: "brain" },
  { id: "other", name: "Other", icon: "more-horizontal" },
]
