import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot, User, FileText, Activity } from 'lucide-react-native';
import { useRorkAgent, createRorkTool } from '@rork/toolkit-sdk';
import { z } from 'zod';

/**
 * HMCAS Clinical Practice Guidelines v2.4 (2025)
 * Official Document: https://drive.google.com/file/d/1dAdQfPTF0ZjmqWZm5CaGqb6Mi_LhZbXZ/view?usp=sharing
 * 
 * This AI assistant helps paramedics navigate the complete CPG v2.4 document.
 * All content below is extracted from the official HMCAS CPG v2.4 2025 document.
 */

interface CPGSection {
  id: string;
  title: string;
  page: number;
  category: string;
  keywords: string[];
  content?: string;
}

const CPG_SECTIONS_MAP: CPGSection[] = [
  // CLINICAL APPROACH AND PATIENT ASSESSMENT
  { id: 'cpg-1.1', title: 'Clinical Approach and Assessment of the Adult Patient', page: 17, category: 'Assessment', keywords: ['1.1', 'adult assessment', 'primary survey', 'secondary survey', 'vital signs', 'avpu', 'scene size-up'] },
  { id: 'cpg-1.2', title: 'Clinical Approach and Assessment of the Paediatric Patient', page: 20, category: 'Assessment', keywords: ['1.2', 'pediatric assessment', 'paediatric', 'child assessment', 'pat', 'pediatric assessment triangle'] },
  { id: 'cpg-1.3', title: 'Clinical Approach and Assessment of the Obstetric Patient', page: 24, category: 'Assessment', keywords: ['1.3', 'obstetric assessment', 'pregnancy', 'gravidity', 'parity', 'fundus height'] },
  { id: 'cpg-1.4', title: 'Consciousness Status Assessment', page: 26, category: 'Assessment', keywords: ['1.4', 'consciousness', 'avpu', 'gcs', 'glasgow coma scale', 'level of consciousness', 'loc'] },
  { id: 'cpg-1.5', title: 'Airway & Respiratory Status Assessment', page: 28, category: 'Assessment', keywords: ['1.5', 'airway', 'respiratory', 'breathing', 'chest auscultation', 'breath sounds'] },
  { id: 'cpg-1.6', title: 'Perfusion Status Assessment', page: 30, category: 'Assessment', keywords: ['1.6', 'perfusion', 'circulation', 'shock', 'blood pressure', 'pulse'] },
  { id: 'cpg-1.7', title: 'Mental Status Assessment', page: 31, category: 'Assessment', keywords: ['1.7', 'mental status', 'psychiatric', 'behavior', 'thought process'] },
  { id: 'cpg-1.8', title: 'Qatar Early Warning Score (QEWS)', page: 32, category: 'Assessment', keywords: ['1.8', 'qews', 'early warning', 'scoring', 'deterioration'] },

  // CARDIAC ARREST - RESUSCITATION
  { id: 'cpg-2.1', title: 'Adult Medical Cardiac Arrest', page: 34, category: 'Cardiac Arrest', keywords: ['2.1', 'adult cardiac arrest', 'cpr', 'vf', 'vt', 'asystole', 'pea', 'adrenaline', 'amiodarone', 'lucas', 'dsed'] },
  { id: 'cpg-2.2', title: 'Adult Trauma Cardiac Arrest', page: 38, category: 'Cardiac Arrest', keywords: ['2.2', 'trauma arrest', 'traumatic cardiac arrest', 'chest decompression', 'thoracostomy'] },
  { id: 'cpg-2.3', title: 'Paediatric Medical Cardiac Arrest', page: 41, category: 'Cardiac Arrest', keywords: ['2.3', 'pediatric arrest', 'paediatric cardiac arrest', 'child cpr', 'waafelss'] },
  { id: 'cpg-2.4', title: 'Paediatric Trauma Cardiac Arrest', page: 45, category: 'Cardiac Arrest', keywords: ['2.4', 'pediatric trauma arrest', 'child trauma arrest'] },
  { id: 'cpg-2.5', title: 'Resuscitation of the New-born & Neonates', page: 48, category: 'Cardiac Arrest', keywords: ['2.5', 'neonatal resuscitation', 'newborn', 'apgar', 'nrp'] },
  { id: 'cpg-2.6', title: 'Post Cardiac Arrest (ROSC) Care', page: 51, category: 'Cardiac Arrest', keywords: ['2.6', 'rosc', 'post arrest', 'return of spontaneous circulation', 'targeted temperature'] },
  { id: 'cpg-2.7', title: 'Termination of Resuscitation / Declaration of Death', page: 54, category: 'Cardiac Arrest', keywords: ['2.7', 'termination', 'tor', 'death', 'dnr', 'obvious death'] },
  { id: 'cpg-2.8', title: 'Cardiac Arrest - Special Circumstances', page: 55, category: 'Cardiac Arrest', keywords: ['2.8', 'special circumstances', 'hypothermia', 'hyperkalaemia', 'cpr induced consciousness'] },
  { id: 'cpg-2.9', title: 'ECMO Pathway Inclusion Criteria', page: 56, category: 'Cardiac Arrest', keywords: ['2.9', 'ecmo', 'e-cpr', 'extracorporeal'] },

  // NEUROLOGICAL
  { id: 'cpg-3.1', title: 'Stroke', page: 58, category: 'Neurological', keywords: ['3.1', 'stroke', 'cva', 'befast', 'tpa', 'thrombolysis', 'cerebrovascular'] },
  { id: 'cpg-3.2', title: 'Seizures', page: 61, category: 'Neurological', keywords: ['3.2', 'seizure', 'epilepsy', 'status epilepticus', 'convulsion', 'midazolam'] },

  // CARDIAC
  { id: 'cpg-4.1', title: 'Acute Coronary Syndrome', page: 65, category: 'Cardiac', keywords: ['4.1', 'acs', 'acute coronary syndrome', 'stemi', 'nstemi', 'mi', 'myocardial infarction', 'heart attack', 'chest pain', 'aspirin', 'clopidogrel', 'gtn'] },
  { id: 'cpg-4.2', title: 'Bradyarrhythmias', page: 69, category: 'Cardiac', keywords: ['4.2', 'bradycardia', 'slow heart rate', 'atropine', 'pacing', 'heart block'] },
  { id: 'cpg-4.3', title: 'Tachyarrhythmias – Broad complex', page: 71, category: 'Cardiac', keywords: ['4.3', 'broad complex tachycardia', 'vt', 'ventricular tachycardia', 'cardioversion'] },
  { id: 'cpg-4.4', title: 'Tachyarrhythmias – Narrow complex', page: 73, category: 'Cardiac', keywords: ['4.4', 'narrow complex tachycardia', 'svt', 'supraventricular', 'adenosine', 'valsalva'] },
  { id: 'cpg-4.5', title: 'Acute Pulmonary Oedema', page: 75, category: 'Cardiac', keywords: ['4.5', 'pulmonary edema', 'pulmonary oedema', 'apo', 'cpap', 'gtn', 'furosemide'] },
  { id: 'cpg-4.6', title: 'Cardiogenic Shock', page: 77, category: 'Cardiac', keywords: ['4.6', 'cardiogenic shock', 'heart failure', 'inotropes', 'noradrenaline'] },

  // RESPIRATORY
  { id: 'cpg-5.1', title: 'Asthma', page: 80, category: 'Respiratory', keywords: ['5.1', 'asthma', 'bronchospasm', 'wheeze', 'salbutamol', 'ipratropium', 'magnesium', 'adrenaline'] },
  { id: 'cpg-5.2', title: 'Chronic Obstructive Pulmonary Disease (COPD)', page: 83, category: 'Respiratory', keywords: ['5.2', 'copd', 'chronic obstructive', 'emphysema', 'bronchitis'] },
  { id: 'cpg-5.3', title: 'Croup', page: 85, category: 'Respiratory', keywords: ['5.3', 'croup', 'stridor', 'barking cough', 'dexamethasone', 'budesonide'] },
  { id: 'cpg-5.4', title: 'Epiglottitis', page: 88, category: 'Respiratory', keywords: ['5.4', 'epiglottitis', 'drooling', 'tripod position'] },
  { id: 'cpg-5.5', title: 'Foreign Body Airway Obstruction', page: 90, category: 'Respiratory', keywords: ['5.5', 'fbao', 'choking', 'foreign body', 'heimlich', 'back slaps'] },
  { id: 'cpg-5.6', title: 'Hyperventilation', page: 92, category: 'Respiratory', keywords: ['5.6', 'hyperventilation', 'tachypnea', 'anxiety'] },
  { id: 'cpg-5.7', title: 'Pulmonary Embolism', page: 94, category: 'Respiratory', keywords: ['5.7', 'pulmonary embolism', 'pe', 'dvt', 'chest pain', 'dyspnea'] },
  { id: 'cpg-5.8', title: 'Severe Respiratory Infection', page: 96, category: 'Respiratory', keywords: ['5.8', 'respiratory infection', 'pneumonia', 'covid'] },
  { id: 'cpg-5.9', title: 'Tracheostomy Emergencies', page: 98, category: 'Respiratory', keywords: ['5.9', 'tracheostomy', 'trach', 'stoma'] },

  // MEDICAL
  { id: 'cpg-6.1', title: 'Abdominal Emergencies (Non-traumatic)', page: 102, category: 'Medical', keywords: ['6.1', 'abdominal pain', 'abdomen', 'aaa', 'gi bleed'] },
  { id: 'cpg-6.2', title: 'Anaphylaxis and Allergic Reactions', page: 104, category: 'Medical', keywords: ['6.2', 'anaphylaxis', 'allergic reaction', 'adrenaline', 'epinephrine', 'epipen'] },
  { id: 'cpg-6.3', title: 'Hypoglycaemia and Hyperglycaemia', page: 108, category: 'Medical', keywords: ['6.3', 'hypoglycemia', 'hyperglycemia', 'diabetes', 'dka', 'glucose', 'dextrose', 'glucagon'] },
  { id: 'cpg-6.4', title: 'Nausea and Vomiting', page: 111, category: 'Medical', keywords: ['6.4', 'nausea', 'vomiting', 'antiemetic', 'ondansetron'] },
  { id: 'cpg-6.5', title: 'Non-Traumatic Shock', page: 113, category: 'Medical', keywords: ['6.5', 'shock', 'hypotension', 'hypovolemic'] },
  { id: 'cpg-6.6', title: 'Sepsis', page: 115, category: 'Medical', keywords: ['6.6', 'sepsis', 'septic shock', 'infection', 'qsofa'] },

  // MENTAL HEALTH AND BEHAVIOURAL DISTURBANCES
  { id: 'cpg-7.1', title: 'Acute Behavioural Disturbance', page: 120, category: 'Mental Health', keywords: ['7.1', 'abd', 'acute behavioural disturbance', 'agitation', 'psychiatric', 'droperidol', 'ketamine', 'sedation', 'sat score'] },

  // TOXICOLOGY AND TOXINOLOGY
  { id: 'cpg-8.1', title: 'Benzodiazepine', page: 127, category: 'Toxicology', keywords: ['8.1', 'benzodiazepine', 'benzo', 'overdose'] },
  { id: 'cpg-8.2', title: 'Beta Blocker', page: 129, category: 'Toxicology', keywords: ['8.2', 'beta blocker', 'overdose'] },
  { id: 'cpg-8.3', title: 'Calcium Channel Blocker', page: 131, category: 'Toxicology', keywords: ['8.3', 'calcium channel blocker', 'overdose'] },
  { id: 'cpg-8.4', title: 'Carbon Monoxide', page: 133, category: 'Toxicology', keywords: ['8.4', 'carbon monoxide', 'co poisoning'] },
  { id: 'cpg-8.5', title: 'Cyanide', page: 135, category: 'Toxicology', keywords: ['8.5', 'cyanide', 'poisoning'] },
  { id: 'cpg-8.6', title: 'Opioids', page: 137, category: 'Toxicology', keywords: ['8.6', 'opioid', 'overdose', 'naloxone', 'narcan'] },
  { id: 'cpg-8.7', title: 'Organophosphates', page: 139, category: 'Toxicology', keywords: ['8.7', 'organophosphate', 'pesticide', 'atropine'] },
  { id: 'cpg-8.8', title: 'Psychostimulants', page: 141, category: 'Toxicology', keywords: ['8.8', 'psychostimulant', 'amphetamine', 'cocaine'] },
  { id: 'cpg-8.9', title: 'Tricyclic Antidepressants', page: 144, category: 'Toxicology', keywords: ['8.9', 'tricyclic', 'tca', 'antidepressant'] },
  { id: 'cpg-8.10', title: 'Alcohol Intoxication', page: 146, category: 'Toxicology', keywords: ['8.10', 'alcohol', 'intoxication', 'drunk'] },
  { id: 'cpg-8.11', title: 'Envenomation', page: 149, category: 'Toxicology', keywords: ['8.11', 'envenomation', 'snake bite', 'scorpion', 'jellyfish'] },

  // ENVIRONMENTAL
  { id: 'cpg-9.1', title: 'Heat-Related Disorders', page: 153, category: 'Environmental', keywords: ['9.1', 'heat stroke', 'heat exhaustion', 'hyperthermia'] },
  { id: 'cpg-9.2', title: 'Cold-Related Disorders', page: 156, category: 'Environmental', keywords: ['9.2', 'hypothermia', 'cold exposure', 'frostbite'] },

  // TRAUMA
  { id: 'cpg-10.1', title: 'Major Haemorrhage and Haemorrhagic Shock', page: 160, category: 'Trauma', keywords: ['10.1', 'hemorrhage', 'haemorrhage', 'bleeding', 'shock', 'txa', 'tranexamic acid', 'tourniquet'] },
  { id: 'cpg-10.2', title: 'Traumatic Brain Injury', page: 162, category: 'Trauma', keywords: ['10.2', 'tbi', 'traumatic brain injury', 'head injury'] },
  { id: 'cpg-10.3', title: 'Spinal Trauma', page: 164, category: 'Trauma', keywords: ['10.3', 'spinal trauma', 'c-spine', 'nexus', 'smr'] },
  { id: 'cpg-10.4', title: 'Chest Trauma', page: 167, category: 'Trauma', keywords: ['10.4', 'chest trauma', 'pneumothorax', 'hemothorax', 'flail chest'] },
  { id: 'cpg-10.5', title: 'Abdominal Trauma', page: 170, category: 'Trauma', keywords: ['10.5', 'abdominal trauma', 'evisceration'] },
  { id: 'cpg-10.6', title: 'Pelvic Trauma', page: 172, category: 'Trauma', keywords: ['10.6', 'pelvic trauma', 'pelvic binder', 'pelvis fracture'] },
  { id: 'cpg-10.7', title: 'Limb Trauma', page: 174, category: 'Trauma', keywords: ['10.7', 'limb trauma', 'fracture', 'splinting', 'traction splint'] },
  { id: 'cpg-10.8', title: 'Trauma in Pregnancy', page: 176, category: 'Trauma', keywords: ['10.8', 'trauma pregnancy', 'pregnant trauma'] },
  { id: 'cpg-10.9', title: 'Burns', page: 178, category: 'Trauma', keywords: ['10.9', 'burns', 'thermal injury', 'burn percentage'] },
  { id: 'cpg-10.10', title: 'Trauma Bypass Criteria', page: 181, category: 'Trauma', keywords: ['10.10', 'trauma bypass', 'tru', 'trauma criteria'] },
  { id: 'cpg-10.11', title: 'Crush Injury', page: 183, category: 'Trauma', keywords: ['10.11', 'crush injury', 'compartment syndrome', 'rhabdomyolysis'] },

  // RSI, MECHANICAL VENTILATION AND SAFE SEDATION
  { id: 'cpg-11.1', title: 'Rapid Sequence Induction', page: 187, category: 'Airway', keywords: ['11.1', 'rsi', 'rapid sequence induction', 'intubation', 'ketamine', 'rocuronium', 'fentanyl'] },
  { id: 'cpg-11.2', title: 'Failed Intubation Drill', page: 191, category: 'Airway', keywords: ['11.2', 'failed intubation', 'cant intubate', 'surgical airway'] },
  { id: 'cpg-11.3', title: 'Safe Sedation', page: 192, category: 'Airway', keywords: ['11.3', 'sedation', 'procedural sedation', 'ketamine', 'midazolam'] },
  { id: 'cpg-11.4', title: 'Mechanical Ventilation', page: 195, category: 'Airway', keywords: ['11.4', 'mechanical ventilation', 'ventilator', 'ippv', 'simv', 'cpap', 'bipap'] },
  { id: 'cpg-11.5', title: 'RSI Quick Reference Guide & Checklist', page: 198, category: 'Airway', keywords: ['11.5', 'rsi checklist', 'rsi guide', 'drug dosing'] },

  // OBSTETRICS
  { id: 'cpg-12.1', title: 'Ectopic Pregnancy', page: 201, category: 'Obstetrics', keywords: ['12.1', 'ectopic pregnancy', 'ectopic'] },
  { id: 'cpg-12.2', title: 'Miscarriage', page: 203, category: 'Obstetrics', keywords: ['12.2', 'miscarriage', 'abortion'] },
  { id: 'cpg-12.3', title: 'Placenta Abruption', page: 205, category: 'Obstetrics', keywords: ['12.3', 'placenta abruption', 'abruption'] },
  { id: 'cpg-12.4', title: 'Placenta Praevia', page: 207, category: 'Obstetrics', keywords: ['12.4', 'placenta praevia', 'placenta previa'] },
  { id: 'cpg-12.5', title: 'Pre-eclampsia and Eclampsia', page: 209, category: 'Obstetrics', keywords: ['12.5', 'preeclampsia', 'eclampsia', 'magnesium', 'seizure pregnancy'] },
  { id: 'cpg-12.6', title: 'Umbilical Cord Prolapse', page: 212, category: 'Obstetrics', keywords: ['12.6', 'cord prolapse', 'umbilical cord'] },
  { id: 'cpg-12.7', title: 'Imminent Delivery', page: 214, category: 'Obstetrics', keywords: ['12.7', 'imminent delivery', 'birth', 'labor', 'labour'] },
  { id: 'cpg-12.8', title: 'Breech Presentation', page: 217, category: 'Obstetrics', keywords: ['12.8', 'breech', 'breech delivery'] },
  { id: 'cpg-12.9', title: 'Pre-term Labour', page: 219, category: 'Obstetrics', keywords: ['12.9', 'preterm labor', 'preterm labour', 'premature'] },
  { id: 'cpg-12.10', title: 'Post Delivery (or 3rd Stage) Complications', page: 221, category: 'Obstetrics', keywords: ['12.10', 'postpartum hemorrhage', 'pph', 'retained placenta', 'uterine inversion'] },
  { id: 'cpg-12.11', title: 'APGAR Score', page: 224, category: 'Obstetrics', keywords: ['12.11', 'apgar', 'apgar score', 'newborn assessment'] },
  { id: 'cpg-12.12', title: 'Obs/Gynae Bypass Criteria', page: 225, category: 'Obstetrics', keywords: ['12.12', 'obstetric bypass', 'gynae bypass'] },

  // OTHER
  { id: 'cpg-13.1', title: 'Pain Management', page: 227, category: 'Other', keywords: ['13.1', 'pain management', 'analgesia', 'fentanyl', 'penthrox', 'paracetamol'] },
  { id: 'cpg-13.2', title: 'Multiple Casualty Incidents', page: 230, category: 'Other', keywords: ['13.2', 'mci', 'mass casualty', 'triage', 'major incident'] },
  { id: 'cpg-13.3', title: 'Patient Refusal of Treatment or Transport', page: 234, category: 'Other', keywords: ['13.3', 'refusal', 'patient refusal', 'rtt'] },
  { id: 'cpg-13.4', title: 'Submersion Incident', page: 235, category: 'Other', keywords: ['13.4', 'drowning', 'submersion', 'near drowning'] },
  { id: 'cpg-13.5', title: 'HAZMAT Incident', page: 237, category: 'Other', keywords: ['13.5', 'hazmat', 'chemical', 'decontamination'] },
  { id: 'cpg-13.6', title: 'IMIST-AMBO Handover', page: 238, category: 'Other', keywords: ['13.6', 'imist', 'handover', 'communication'] },
  { id: 'cpg-13.7', title: 'Sexual Assault', page: 239, category: 'Other', keywords: ['13.7', 'sexual assault', 'rape'] },

  // VULNERABLE PATIENTS
  { id: 'cpg-14.1', title: 'Elderly Patients (>65 years old)', page: 241, category: 'Vulnerable Patients', keywords: ['14.1', 'elderly', 'geriatric', 'older adult'] },
  { id: 'cpg-14.2', title: 'Bariatric Patients', page: 244, category: 'Vulnerable Patients', keywords: ['14.2', 'bariatric', 'obese', 'obesity'] },
  { id: 'cpg-14.3', title: 'Patients Receiving Renal Dialysis', page: 246, category: 'Vulnerable Patients', keywords: ['14.3', 'dialysis', 'renal', 'hemodialysis', 'peritoneal dialysis'] },

  // INTER-FACILITY TRANSFER GUIDELINES
  { id: 'cpg-15.1', title: 'Continuation of Previously Prescribed Medication', page: 250, category: 'Transfer', keywords: ['15.1', 'transfer medication', 'continuation'] },
  { id: 'cpg-15.2', title: 'Use of Specialist Medication During Transfer', page: 252, category: 'Transfer', keywords: ['15.2', 'specialist medication', 'transfer'] },
  { id: 'cpg-15.3', title: 'Drug Chart for frequently used transfer medications', page: 253, category: 'Transfer', keywords: ['15.3', 'drug chart', 'transfer medications', 'infusions'] },
  { id: 'cpg-15.4', title: 'AP Transfer of Patients with Infusion Devices', page: 256, category: 'Transfer', keywords: ['15.4', 'infusion device', 'ap transfer'] },
  { id: 'cpg-15.5', title: 'RASS', page: 258, category: 'Transfer', keywords: ['15.5', 'rass', 'richmond agitation sedation scale'] },
  { id: 'cpg-15.6', title: 'Retrieval Service Patient Transfer Checklist', page: 259, category: 'Transfer', keywords: ['15.6', 'transfer checklist', 'retrieval'] },

  // SCHEDULED AMBULANCE SERVICE GUIDELINES
  { id: 'cpg-16.1', title: 'Clinical Approach to Scheduled Ambulance Service Transfer Patients', page: 261, category: 'Scheduled Service', keywords: ['16.1', 'scheduled service', 'sas', 'non-emergency'] },

  // COVID-19 CLINICAL GUIDELINES
  { id: 'cpg-17.1', title: 'Respiratory Distress/Hypoxaemia in Suspected/Confirmed COVID-19 Patients', page: 265, category: 'COVID-19', keywords: ['17.1', 'covid', 'covid-19', 'coronavirus', 'respiratory distress', 'dexamethasone'] },
  { id: 'cpg-17.2', title: 'Cardiac Arrest Management in Suspected/Confirmed COVID-19 Patient', page: 267, category: 'COVID-19', keywords: ['17.2', 'covid arrest', 'covid cardiac arrest'] },
];

const APP_SECTIONS = {
  pediatric: {
    title: 'Pediatric Guidelines',
    route: '/pediatric',
    description: 'Pediatric dosing, weight-based calculations, and age-specific protocols'
  },
  scores: {
    title: 'Clinical Scores',
    route: '/scores',
    description: 'GCS, APGAR, AVPU, and other clinical scoring systems'
  },
  waafels: {
    title: 'WAAFELS Protocol',
    route: '/waafels',
    description: 'Wound assessment and fluid estimation guidelines'
  },
  files: {
    title: 'Clinical Files',
    route: '/files',
    description: 'Complete CPG 2.4v documentation and reference files'
  },
  care: {
    title: 'Patient Care',
    route: '/care',
    description: 'Patient care protocols and procedures'
  },
  flowchart: {
    title: 'Clinical Flowcharts',
    route: '/flowchart',
    description: 'Decision trees and clinical pathways for various conditions'
  },
  rsi: {
    title: 'RSI Protocol',
    route: '/rsi',
    description: 'Rapid Sequence Intubation guidelines and medications'
  },
  cpr: {
    title: 'CPR Timer',
    route: '/cpr',
    description: 'CPR timing and compression guidelines'
  },
};

export default function AIAssistantScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage } = useRorkAgent({
    tools: {
      openCPGSection: createRorkTool({
        description: 'Open a specific CPG section from the HMCAS Clinical Practice Guidelines v2.4 (2025). Use this when the user asks for a specific protocol by CPG number (e.g., "CPG 1.6", "2.1") or by clinical topic (e.g., "cardiac arrest", "stroke", "asthma"). The official document is at: https://drive.google.com/file/d/1dAdQfPTF0ZjmqWZm5CaGqb6Mi_LhZbXZ/view',
        zodSchema: z.object({
          cpgNumber: z.string().describe('CPG section number like "1.6", "2.1", "3.4" or topic name like "cardiac arrest", "stroke", "asthma"'),
          reason: z.string().describe('Brief explanation of why this section is relevant to the user query')
        }),
        execute(input) {
          console.log('[AI Assistant] Opening CPG section:', input.cpgNumber);
          
          const query = input.cpgNumber.toLowerCase().trim();
          
          let matchedSection = CPG_SECTIONS_MAP.find(section => 
            section.keywords.some(keyword => 
              query.includes(keyword) || keyword.includes(query)
            )
          );
          
          if (matchedSection) {
            console.log('[AI Assistant] Found section:', matchedSection.title, 'ID:', matchedSection.id);
            
            setTimeout(() => {
              router.push({
                pathname: '/files',
                params: { 
                  openSection: matchedSection!.id,
                  sectionTitle: matchedSection!.title,
                  page: matchedSection!.page.toString()
                }
              } as any);
            }, 500);
            
            return `✓ Opening: **${matchedSection.title}** (CPG Page ${matchedSection.page})\n\n${input.reason}\n\n📄 Source: HMCAS CPG v2.4 (2025)\n🔗 Full PDF: https://drive.google.com/file/d/1dAdQfPTF0ZjmqWZm5CaGqb6Mi_LhZbXZ/view`;
          }
          
          return `Could not find CPG section "${input.cpgNumber}". Please try searching by topic name (e.g., "cardiac arrest", "stroke", "asthma") or CPG number (e.g., "1.6", "2.1").`;
        },
      }),
      navigateToAppSection: createRorkTool({
        description: 'Navigate to app features like calculators, timers, and tools (not CPG content)',
        zodSchema: z.object({
          section: z.enum([
            'pediatric',
            'scores',
            'waafels',
            'files',
            'care',
            'flowchart',
            'rsi',
            'cpr'
          ]).describe('The app section to navigate to'),
          reason: z.string().describe('Brief explanation of why this section is relevant')
        }),
        execute(input) {
          const section = APP_SECTIONS[input.section];
          if (section) {
            setTimeout(() => {
              router.push(section.route as any);
            }, 500);
            return `Navigating to ${section.title}: ${input.reason}`;
          }
          return 'Section not found';
        },
      }),
      searchCPG: createRorkTool({
        description: 'Search the HMCAS CPG v2.4 (2025) to find relevant protocols. Use this when the user describes symptoms, conditions, or asks "what protocol for..." questions. Source: https://drive.google.com/file/d/1dAdQfPTF0ZjmqWZm5CaGqb6Mi_LhZbXZ/view',
        zodSchema: z.object({
          query: z.string().describe('The search query - can be symptoms, conditions, medications, or procedures'),
          category: z.string().describe('Optional category to narrow search: Assessment, Cardiac Arrest, Neurological, Cardiac, Respiratory, Medical, Mental Health, Toxicology, Environmental, Trauma, Airway, Obstetrics, Other, Vulnerable Patients, Transfer, Scheduled Service, COVID-19').optional(),
        }),
        execute(input) {
          console.log('[AI Assistant] Searching CPG for:', input.query);
          
          const query = input.query.toLowerCase();
          const matchedSections = CPG_SECTIONS_MAP.filter(section => {
            const matchesQuery = section.title.toLowerCase().includes(query) ||
                                section.keywords.some(k => k.includes(query) || query.includes(k));
            const matchesCategory = !input.category || section.category.toLowerCase() === input.category.toLowerCase();
            return matchesQuery && matchesCategory;
          });
          
          if (matchedSections.length === 0) {
            return `No CPG sections found for "${input.query}". Try different keywords or ask me to list available sections.`;
          }
          
          const results = matchedSections.slice(0, 5).map(section => 
            `• ${section.title} (${section.category}) - Page ${section.page}`
          ).join('\n');
          
          return `Found ${matchedSections.length} protocol(s) in HMCAS CPG v2.4 matching "${input.query}":\n\n${results}\n\nWould you like me to open any of these? Just ask "open [protocol name]" or "open CPG [number]".`;
        },
      }),
      listCPGCategories: createRorkTool({
        description: 'List all available CPG categories and their sections to help users navigate',
        zodSchema: z.object({
          category: z.string().describe('Optional specific category to list: Assessment, Cardiac Arrest, Neurological, Cardiac, Respiratory, Medical, Mental Health, Toxicology, Environmental, Trauma, Airway, Obstetrics, Other, Vulnerable Patients, Transfer, Scheduled Service, COVID-19').optional(),
        }),
        execute(input) {
          if (input.category) {
            const sections = CPG_SECTIONS_MAP.filter(s => 
              s.category.toLowerCase() === (input.category?.toLowerCase() || '')
            );
            
            if (sections.length === 0) {
              return `Category "${input.category}" not found. Available categories: Assessment, Cardiac Arrest, Neurological, Cardiac, Respiratory, Medical, Mental Health, Toxicology, Environmental, Trauma, Airway, Obstetrics, Other, Vulnerable Patients, Transfer, Scheduled Service, COVID-19`;
            }
            
            const list = sections.map(s => `• ${s.title} - Page ${s.page}`).join('\n');
            return `${input.category} Protocols in CPG 2.4v:\n\n${list}`;
          }
          
          const categories = Array.from(new Set(CPG_SECTIONS_MAP.map(s => s.category)));
          const summary = categories.map(cat => {
            const count = CPG_SECTIONS_MAP.filter(s => s.category === cat).length;
            return `• ${cat} (${count} protocols)`;
          }).join('\n');
          
          return `CPG 2.4v Categories:\n\n${summary}\n\nAsk me to list a specific category or search for a protocol!`;
        },
      }),
    },
  });

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      try {
        await sendMessage(input.trim());
        setInput('');
      } catch (err) {
        console.error('[AI Assistant] Error sending message:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Assistant',
          headerStyle: { backgroundColor: '#2C5F8D' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: insets.bottom + 16 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIconContainer}>
                <Bot size={48} color="#4A90E2" />
              </View>
              <Text style={styles.welcomeTitle}>CPG 2.4v AI Assistant</Text>
              <Text style={styles.welcomeText}>
                I help you navigate the HMCAS Clinical Practice Guidelines v2.4 (2025). Ask me to find or open any protocol.
              </Text>
              
              <View style={styles.sourceContainer}>
                <FileText size={18} color="#2C5F8D" />
                <View style={styles.sourceTextContainer}>
                  <Text style={styles.sourceTitle}>Official Source</Text>
                  <Text style={styles.sourceSubtitle}>HMCAS CPG v2.4 (2025)</Text>
                  <Text style={styles.sourceLink}>drive.google.com/file/d/1dAdQfPTF0ZjmqWZm5CaGqb6Mi_LhZbXZ</Text>
                </View>
              </View>
              
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Try asking:</Text>
                {[
                  'Open CPG 1.6',
                  'Show me the cardiac arrest protocol',
                  'I need the stroke protocol',
                  'What are the asthma management guidelines?',
                  'Show me all cardiac protocols',
                  'Open the trauma section',
                ].map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exampleButton}
                    onPress={() => setInput(example)}
                  >
                    <Text style={styles.exampleText}>{example}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <View style={styles.messageHeader}>
                <View style={[
                  styles.avatarContainer,
                  message.role === 'user' ? styles.userAvatar : styles.assistantAvatar
                ]}>
                  {message.role === 'user' ? (
                    <User size={16} color="#fff" />
                  ) : (
                    <Bot size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.roleText}>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </Text>
              </View>

              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <View key={index} style={styles.textContent}>
                      <Text style={styles.messageText}>{part.text}</Text>
                    </View>
                  );
                }

                if (part.type === 'tool') {
                  const toolName = part.toolName || '';
                  
                  if (part.state === 'input-streaming' || part.state === 'input-available') {
                    return (
                      <View key={index} style={styles.toolContainer}>
                        <Activity size={14} color="#4A90E2" />
                        <Text style={styles.toolText}>
                          {toolName === 'openCPGSection' && 'Opening CPG section...'}
                          {toolName === 'navigateToAppSection' && 'Navigating to section...'}
                          {toolName === 'searchCPG' && 'Searching guidelines...'}
                          {toolName === 'listCPGCategories' && 'Loading categories...'}
                        </Text>
                      </View>
                    );
                  }

                  if (part.state === 'output-available') {
                    return (
                      <View key={index} style={styles.toolResultContainer}>
                        <FileText size={14} color="#27AE60" />
                        <Text style={styles.toolResultText}>
                          {toolName === 'openCPGSection' && '✓ Opening CPG document'}
                          {toolName === 'navigateToAppSection' && '✓ Opening section'}
                          {toolName === 'searchCPG' && '✓ Search completed'}
                          {toolName === 'listCPGCategories' && '✓ Categories loaded'}
                        </Text>
                      </View>
                    );
                  }

                  if (part.state === 'output-error') {
                    return (
                      <View key={index} style={styles.toolErrorContainer}>
                        <Text style={styles.toolErrorText}>Error: {part.errorText}</Text>
                      </View>
                    );
                  }
                }

                return null;
              })}
            </View>
          ))}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 16 }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about CPG 2.4v guidelines..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  examplesContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  exampleButton: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D6E9FF',
  },
  exampleText: {
    fontSize: 14,
    color: '#2C5F8D',
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: '#4A90E2',
  },
  assistantAvatar: {
    backgroundColor: '#27AE60',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  textContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  toolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  toolText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '500',
  },
  toolResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  toolResultText: {
    fontSize: 13,
    color: '#27AE60',
    fontWeight: '500',
  },
  toolErrorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  toolErrorText: {
    fontSize: 13,
    color: '#E74C3C',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#E74C3C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: '100%',
  },
  sourceTextContainer: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sourceSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C5F8D',
    marginBottom: 6,
  },
  sourceLink: {
    fontSize: 11,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
