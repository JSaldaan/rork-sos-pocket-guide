import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Platform,
  Linking,
} from 'react-native';
import { 
  Search, 
  Download, 
  FileText, 
  ChevronRight, 
  Book, 
  Heart, 
  Activity, 
  AlertCircle,
  Bookmark,
  Star,
  X,
  ChevronLeft,
  Share2,
  Printer,
  Clock,
  FileCheck,
  Wifi,
  WifiOff,
  ExternalLink
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

type DocumentTab = 'CPG' | 'PAT' | 'SOP' | 'CPM';
type ViewMode = 'overview' | 'viewer' | 'search' | 'bookmarks' | 'recent' | 'settings';

interface DocumentSection {
  id: string;
  title: string;
  page: number;
  content?: string;
  subsections?: DocumentSection[];
}

interface Document {
  title: string;
  version: string;
  lastUpdated: string;
  sections: DocumentSection[];
  downloadStatus?: 'none' | 'downloading' | 'downloaded';
  lastAccessed?: Date;
  fileSize?: string;
}

interface Bookmark {
  id: string;
  documentTab: DocumentTab;
  sectionId: string;
  sectionTitle: string;
  page: number;
  note?: string;
  createdAt: Date;
}

interface RecentDocument {
  id: string;
  documentTab: DocumentTab;
  sectionId?: string;
  title: string;
  accessedAt: Date;
}

interface SearchResult {
  documentTab: DocumentTab;
  sectionId: string;
  sectionTitle: string;
  page: number;
  matchText: string;
  context: string;
}
import * as WebBrowser from 'expo-web-browser';

export default function FilesScreen() {
  const params = useLocalSearchParams<{ openSection?: string; sectionTitle?: string; page?: string }>();
  const [activeTab, setActiveTab] = useState<DocumentTab>('CPG');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState('1');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSection, setCurrentSection] = useState<DocumentSection | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [downloadedDocs, setDownloadedDocs] = useState<DocumentTab[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    // Load saved data on component mount
    loadSavedData();
  }, []);

  useEffect(() => {
    // Handle navigation from AI assistant
    if (params.openSection && params.sectionTitle && params.page) {
      console.log('[Files] Opening section from AI:', params.openSection, params.sectionTitle, params.page);
      
      const findSection = (sections: DocumentSection[], id: string): DocumentSection | undefined => {
        for (const section of sections) {
          if (section.id === id) return section;
          if (section.subsections) {
            const found = findSection(section.subsections, id);
            if (found) return found;
          }
        }
        return undefined;
      };
      
      const section = findSection(cpgDocument.sections, params.openSection);
      if (section) {
        const sectionWithContent: DocumentSection = {
          ...section,
          content: getDocumentContent(section.id, section.title)
        };
        setCurrentSection(sectionWithContent);
        setViewMode('viewer');
        setActiveTab('CPG');
        addToRecent('CPG', section.id, section.title);
      }
    }
  }, [params.openSection, params.sectionTitle, params.page]);

  const loadSavedData = () => {
    // Simulate loading saved bookmarks and recent documents
    const savedBookmarks: Bookmark[] = [
      {
        id: '1',
        documentTab: 'CPG',
        sectionId: 'cardiac-2',
        sectionTitle: 'Cardiac Arrest - Adult',
        page: 22,
        note: 'Updated algorithm - review regularly',
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: '2',
        documentTab: 'PAT',
        sectionId: 'pat-em-1',
        sectionTitle: 'Pediatric Cardiac Arrest',
        page: 13,
        createdAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];
    
    const savedRecent: RecentDocument[] = [
      {
        id: '1',
        documentTab: 'CPG',
        sectionId: 'cardiac-1',
        title: 'Acute Coronary Syndrome (ACS)',
        accessedAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: '2',
        documentTab: 'SOP',
        title: 'Standard Operating Procedures',
        accessedAt: new Date(Date.now() - 7200000) // 2 hours ago
      }
    ];
    
    setBookmarks(savedBookmarks);
    setRecentDocuments(savedRecent);
    setFavorites(['cardiac-2', 'pat-em-1']);
    setDownloadedDocs(['CPG', 'PAT']);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const addToRecent = (documentTab: DocumentTab, sectionId?: string, title?: string) => {
    const newRecent: RecentDocument = {
      id: Date.now().toString(),
      documentTab,
      sectionId,
      title: title || getDocumentByTab(documentTab).title,
      accessedAt: new Date()
    };
    
    setRecentDocuments(prev => {
      const filtered = prev.filter(item => 
        !(item.documentTab === documentTab && item.sectionId === sectionId)
      );
      return [newRecent, ...filtered].slice(0, 10); // Keep only 10 recent items
    });
  };

  const toggleBookmark = (sectionId: string, sectionTitle: string, page: number) => {
    const existingBookmark = bookmarks.find(b => 
      b.documentTab === activeTab && b.sectionId === sectionId
    );
    
    if (existingBookmark) {
      setBookmarks(prev => prev.filter(b => b.id !== existingBookmark.id));
      Alert.alert('Bookmark Removed', `Removed bookmark for ${sectionTitle}`);
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        documentTab: activeTab,
        sectionId,
        sectionTitle,
        page,
        createdAt: new Date()
      };
      setBookmarks(prev => [newBookmark, ...prev]);
      Alert.alert('Bookmark Added', `Added bookmark for ${sectionTitle}`);
    }
  };

  const toggleFavorite = (sectionId: string) => {
    setFavorites(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isBookmarked = (sectionId: string) => {
    return bookmarks.some(b => b.documentTab === activeTab && b.sectionId === sectionId);
  };

  const isFavorite = (sectionId: string) => {
    return favorites.includes(sectionId);
  };

  const DRIVE_BASE = '';
  const FLOWCHART_FILE = '';
  const FLOWCHART_DOWNLOAD = '';

  interface FileItem {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'folder';
    url?: string;
    size?: string;
    description?: string;
  }

  const availableFiles: FileItem[] = [];


  const documentUrls: Partial<Record<DocumentTab, string>> = useMemo(() => ({
    CPG: '',
    PAT: '',
    SOP: '',
    CPM: '',
  }), []);

  const openFlowchartFile = useCallback(() => {
    console.log('[Files] Opening Flowchart File:', FLOWCHART_FILE);
    openInBrowser(FLOWCHART_FILE);
  }, []);

  const downloadFlowchartFile = useCallback(() => {
    console.log('[Files] Downloading Flowchart File:', FLOWCHART_DOWNLOAD);
    openInBrowser(FLOWCHART_DOWNLOAD);
  }, []);

  const openInBrowser = async (url: string) => {
    console.log('[Files] All documents are embedded in the app');
    console.log('[Files] Use the table of contents to navigate to specific sections');
  };

  const openExternalDocument = useCallback((tab: DocumentTab, page?: number, sectionTitle?: string) => {
    console.log('[Files] Opening document section:', { tab, page, sectionTitle });
    // Open the document viewer with the specific section
    if (sectionTitle) {
      const section: DocumentSection = { 
        id: `section-${page}`, 
        title: sectionTitle, 
        page: page || 1 
      };
      setCurrentSection(section);
      setViewMode('viewer');
      addToRecent(tab, section.id, sectionTitle);
    }
  }, []);

  const navigateToPage = (page: number, sectionId?: string, sectionTitle?: string) => {
    setPageNumber(page.toString());
    if (sectionId && sectionTitle) {
      addToRecent(activeTab, sectionId, sectionTitle);
      const section: DocumentSection = { id: sectionId, title: sectionTitle, page };
      setCurrentSection(section);
      setViewMode('viewer');
    }
  };

  const openDocumentViewer = (section: DocumentSection) => {
    console.log('[Files] Open viewer - Table of Contents clicked', { section, activeTab, page: section.page });
    
    // Create a section with full content based on the section ID
    const sectionWithContent: DocumentSection = {
      ...section,
      content: getDocumentContent(section.id, section.title)
    };
    
    setCurrentSection(sectionWithContent);
    setViewMode('viewer');
    addToRecent(activeTab, section.id, section.title);
    
    // Scroll to top when opening viewer
    console.log('[Files] Document viewer opened for:', section.title);
  };

  const getDocumentContent = (sectionId: string, sectionTitle: string): string => {
    // Return specific content based on section ID
    const contentMap: Record<string, string> = {
      'intro-1': `PURPOSE AND APPLICATION\n\nThese Clinical Practice Guidelines (CPG) provide evidence-based protocols for Hamad Medical Corporation Ambulance Service (HMCAS) healthcare practitioners. This document serves as the authoritative reference for all pre-hospital emergency medical care delivered in Qatar.\n\nScope:\n• Applies to all QCHP-licensed ambulance service healthcare practitioners\n• Covers emergency medical response across Qatar\n• Integrates with Qatar healthcare system protocols\n• Aligns with international best practices (AHA, ERC, ILCOR)\n\nKey Principles:\n1. Patient safety is paramount\n2. Evidence-based practice\n3. Continuous quality improvement\n4. Cultural sensitivity and respect\n5. Effective communication with receiving facilities\n\nThese guidelines must be followed unless clinical judgment and patient condition warrant deviation, which must be documented and reported.`,
      'intro-2': `CLINICAL GOVERNANCE FRAMEWORK\n\nHMCAS operates under a robust clinical governance structure ensuring high-quality, safe patient care:\n\nMedical Director Oversight:\n• Dr. Ahmed Al-Mahmoud, MD, FACEP\n• Final authority on clinical protocols\n• Reviews all critical incidents\n• Approves protocol updates\n\nQuality Assurance:\n• Continuous monitoring of clinical performance\n• Regular case reviews and audits\n• Feedback mechanisms for practitioners\n• Incident reporting and analysis\n\nClinical Supervision:\n• Tiered supervision based on certification level\n• Regular skills assessments\n• Continuing education requirements\n• Peer review processes\n\nDocumentation Standards:\n• Complete and accurate patient care records\n• Timely submission of reports\n• Standardized terminology\n• Legal and regulatory compliance`,
      'intro-3': `SCOPE OF PRACTICE BY CERTIFICATION LEVEL\n\nBLS (Basic Life Support) - EMT-B:\n• Basic airway management (OPA, NPA)\n• Oxygen therapy\n• Basic wound care and hemorrhage control\n• Spinal immobilization\n• Automated external defibrillation\n• Basic patient assessment\n• Limited medication administration (aspirin, glucose)\n\nILS (Intermediate Life Support) - EMT-I:\n• All BLS skills plus:\n• IV/IO access\n• Advanced airway devices (LMA, iGel)\n• Expanded medication formulary\n• 12-lead ECG acquisition\n• Blood glucose monitoring\n\nALS (Advanced Life Support) - Paramedic:\n• All ILS skills plus:\n• Endotracheal intubation\n• Manual defibrillation and cardioversion\n• Full medication formulary\n• Advanced cardiac life support\n• 12-lead ECG interpretation\n• Needle thoracostomy\n\nCCP (Critical Care Paramedic):\n• All ALS skills plus:\n• Ventilator management\n• Blood product administration\n• Advanced hemodynamic monitoring\n• Specialized medications and infusions\n• Inter-facility critical care transport`,
      'cardiac-1': `ACUTE CORONARY SYNDROME (ACS) - 2025 PROTOCOL\n\nRecognition:\n• Chest pain/pressure/discomfort\n• Radiation to arm, jaw, neck, back\n• Associated symptoms: SOB, diaphoresis, nausea, weakness\n• Atypical presentations in elderly, diabetics, women\n\nImmediate Actions (First 10 Minutes):\n1. Primary assessment (ABC)\n2. High-flow oxygen if SpO2 <94%\n3. Aspirin 300mg PO (chewed)\n4. IV access\n5. 12-lead ECG <10 minutes from patient contact\n6. Vital signs and continuous monitoring\n\nECG Interpretation:\n• STEMI: ST elevation ≥1mm in 2 contiguous leads\n• NSTEMI: ST depression, T-wave inversion\n• New LBBB with clinical suspicion\n\nSTEMI Management:\n• Activate cath lab (door-to-balloon <90 min)\n• Dual antiplatelet therapy\n• Heparin 60 units/kg IV bolus (max 4000 units)\n• Nitroglycerin 0.4mg SL q5min x3 (if SBP >90mmHg)\n• Morphine 2-4mg IV for pain (use sparingly)\n• Rapid transport to PCI center\n\nNSTEMI/Unstable Angina:\n• Risk stratification (HEART score)\n• Aspirin + Clopidogrel 300mg\n• Nitroglycerin for ongoing pain\n• Transport to cardiac center\n\nContraindications to Nitroglycerin:\n• SBP <90mmHg or >30mmHg below baseline\n• Severe bradycardia (<50) or tachycardia (>100)\n• RV infarction (inferior STEMI with right-sided changes)\n• Phosphodiesterase inhibitor use within 24-48 hours\n\nTransport Considerations:\n• Pre-hospital notification to receiving facility\n• Continuous monitoring and serial ECGs\n• Prepare for complications (arrhythmias, cardiac arrest)\n• Document time of symptom onset precisely`,
      'cardiac-2': `CARDIAC ARREST - ADULT (UPDATED ALGORITHM)\n\n2025 AHA/ERC Guidelines Implementation\n\nImmediate Recognition:\n• Unresponsive\n• No normal breathing\n• No pulse (check <10 seconds)\n\nHigh-Quality CPR:\n• Rate: 100-120 compressions/minute\n• Depth: 5-6 cm (2-2.4 inches)\n• Complete chest recoil\n• Minimize interruptions (<10 seconds)\n• Compression fraction >80%\n• Rotate compressors every 2 minutes\n\nAirway Management:\n• BVM with high-flow oxygen initially\n• Consider advanced airway after initial resuscitation\n• Waveform capnography (target EtCO2 >10mmHg)\n• Avoid hyperventilation (10 breaths/min after advanced airway)\n\nShockable Rhythms (VF/pVT):\n1. Immediate defibrillation 150-200J biphasic\n2. Resume CPR immediately for 2 minutes\n3. Epinephrine 1mg IV/IO after 2nd shock, then q3-5min\n4. Amiodarone 300mg IV/IO after 3rd shock\n5. Repeat defibrillation at maximum energy\n6. Consider double sequential defibrillation if refractory\n\nNon-Shockable Rhythms (Asystole/PEA):\n1. High-quality CPR\n2. Epinephrine 1mg IV/IO immediately, then q3-5min\n3. Search for reversible causes (4Hs & 4Ts)\n4. Consider atropine 3mg IV/IO for asystole (one-time dose)\n\nReversible Causes (4Hs & 4Ts):\nHypoxia - ensure adequate oxygenation\nHypovolemia - fluid resuscitation\nHypo/Hyperkalemia - treat electrolyte abnormalities\nHypothermia - rewarm if indicated\nTension pneumothorax - needle decompression\nTamponade (cardiac) - pericardiocentesis if trained\nToxins - consider antidotes\nThrombosis (coronary/pulmonary) - consider thrombolytics\n\nPost-ROSC Care:\n• Target SpO2 94-98%\n• Avoid hyperventilation\n• Maintain SBP >90mmHg\n• 12-lead ECG\n• Treat underlying cause\n• Consider targeted temperature management\n• Rapid transport to appropriate facility\n\nTermination of Resuscitation:\nConsider after 20 minutes of ALS with:\n• No ROSC\n• Asystole throughout\n• No reversible causes identified\n• Medical director consultation if available`,
      'respiratory': `RESPIRATORY EMERGENCIES\n\nThis section covers comprehensive management of respiratory emergencies including asthma, COPD, pulmonary edema, and respiratory failure.\n\nKey Assessment Points:\n• Respiratory rate and effort\n• Oxygen saturation\n• Breath sounds\n• Use of accessory muscles\n• Mental status\n• Ability to speak in full sentences\n\nImmediate Interventions:\n1. Position of comfort (usually upright)\n2. High-flow oxygen\n3. Continuous monitoring\n4. IV access\n5. Specific treatment based on cause\n\nRefer to specific subsections for detailed protocols on asthma, COPD, pulmonary edema, anaphylaxis, and COVID-19 management.`,
      'trauma': `MAJOR TRAUMA MANAGEMENT\n\nTrauma is a leading cause of death and disability. Rapid assessment and appropriate management are critical.\n\nPrimary Survey (ABCDE):\nA - Airway with C-spine protection\nB - Breathing and ventilation\nC - Circulation with hemorrhage control\nD - Disability (neurological status)\nE - Exposure and environmental control\n\nMechanism of Injury:\n• High-speed motor vehicle collision\n• Fall from height >6 meters\n• Pedestrian struck by vehicle\n• Penetrating trauma to head, neck, torso\n• Blast injury\n• Crush injury\n\nCritical Interventions:\n• Hemorrhage control (tourniquets, hemostatic agents)\n• Spinal immobilization if indicated\n• Chest decompression for tension pneumothorax\n• Pelvic binder for unstable pelvis\n• Fluid resuscitation (permissive hypotension)\n• Rapid transport to trauma center\n\nTrauma Center Criteria:\n• GCS <14\n• SBP <90mmHg\n• Respiratory rate <10 or >29\n• Penetrating injuries to head, neck, torso, extremities\n• Flail chest\n• Two or more proximal long bone fractures\n• Crushed, degloved, or mangled extremity\n• Amputation proximal to wrist or ankle\n• Pelvic fractures\n• Open or depressed skull fracture\n• Paralysis`,
      'neuro': `NEUROLOGICAL EMERGENCIES\n\nNeurological emergencies require rapid recognition and time-critical interventions.\n\nStroke Assessment (FAST-PLUS):\nF - Face drooping\nA - Arm weakness\nS - Speech difficulty\nT - Time to call emergency services\nPLUS:\n• Balance problems\n• Eyesight changes\n• Severe headache\n\nSeizure Management:\n• Protect from injury\n• Time the seizure\n• Position on side if possible\n• Oxygen therapy\n• Check blood glucose\n• Benzodiazepines for status epilepticus (>5 minutes)\n\nAltered Mental Status:\n• AEIOU TIPS mnemonic\n• Blood glucose check\n• Vital signs\n• Neurological exam\n• Consider toxicological causes\n\nHeadache Red Flags:\n• Sudden onset "thunderclap"\n• Worst headache of life\n• Associated with neurological deficits\n• Fever and neck stiffness\n• Recent head trauma\n• Age >50 with new onset\n• Immunocompromised patient`,
      'obstetric': `OBSTETRIC & GYNECOLOGICAL EMERGENCIES\n\nPregnancy-related emergencies require special considerations for both mother and fetus.\n\nImminent Delivery:\n• Crowning visible\n• Strong urge to push\n• Contractions <2 minutes apart\n• Multiparous patient\n\nDelivery Procedure:\n1. Prepare sterile field\n2. Support head as it delivers\n3. Check for nuchal cord\n4. Deliver anterior shoulder\n5. Deliver posterior shoulder\n6. Deliver body\n7. Dry and stimulate baby\n8. Clamp and cut cord\n9. Deliver placenta\n10. Massage uterus\n\nNeonatal Resuscitation:\n• Dry, warm, stimulate\n• Position airway\n• Suction if needed\n• Assess breathing and heart rate\n• Positive pressure ventilation if needed\n• Chest compressions if HR <60\n\nPostpartum Hemorrhage:\n• Uterine massage\n• Oxytocin 10 units IM\n• Bimanual compression if needed\n• Fluid resuscitation\n• Rapid transport\n\nEclampsia:\n• Seizure in pregnant/postpartum patient\n• Magnesium sulfate 4-6g IV over 20 minutes\n• Protect airway\n• Left lateral position\n• Blood pressure management\n• Rapid transport`,
      'environmental': `ENVIRONMENTAL EMERGENCIES\n\nQatar's climate presents unique challenges for environmental emergencies, particularly heat-related illness.\n\nHeat-Related Illness (Qatar Specific):\n\nHeat Exhaustion:\n• Heavy sweating\n• Weakness, dizziness\n• Nausea, headache\n• Normal or slightly elevated temperature\nTreatment:\n• Move to cool environment\n• Remove excess clothing\n• Oral rehydration if conscious\n• Cool packs to neck, axilla, groin\n• IV fluids if needed\n\nHeat Stroke:\n• Core temperature >40°C (104°F)\n• Altered mental status\n• Hot, dry skin (may still sweat)\n• Seizures possible\nTreatment:\n• Aggressive cooling (ice packs, wet sheets, fans)\n• IV fluids\n• Protect airway\n• Monitor for complications\n• Rapid transport\n\nDrowning:\n• Remove from water safely\n• Immediate CPR if needed\n• Assume spinal injury if diving/trauma\n• High-flow oxygen\n• Warm if hypothermic\n• Transport all submersion victims\n\nPoisoning:\n• Identify substance if possible\n• Supportive care\n• Contact poison control\n• Specific antidotes if available\n• Decontamination if appropriate\n• Prevent aspiration\n\nEnvenomation (Regional Species):\n• Identify species if safe\n• Immobilize affected limb\n• Remove jewelry/constrictive items\n• Mark leading edge of swelling\n• Do NOT apply tourniquet\n• Do NOT cut or suck venom\n• Transport to facility with antivenom`,
      'formulary': `MEDICATION FORMULARY\n\nQatar Ambulance Service Approved Medications\n\nCardiovascular Medications:\n\nEpinephrine (Adrenaline):\n• Cardiac arrest: 1mg IV/IO q3-5min\n• Anaphylaxis: 0.5mg IM (1:1000)\n• Bradycardia: 2-10mcg/min infusion\n\nAmiodarone:\n• Cardiac arrest VF/pVT: 300mg IV/IO\n• Stable VT: 150mg IV over 10 minutes\n• Maintenance: 1mg/min infusion\n\nAtropine:\n• Bradycardia: 0.5mg IV q3-5min (max 3mg)\n• Organophosphate poisoning: 2mg IV/IM\n\nAspirin:\n• ACS: 300mg PO (chewed)\n• Contraindications: active bleeding, severe allergy\n\nNitroglycerin:\n• Angina/ACS: 0.4mg SL q5min x3\n• Pulmonary edema: 0.4mg SL q5min\n• Contraindications: SBP <90, RV infarct, PDE5 inhibitors\n\nRespiratory Medications:\n\nSalbutamol (Albuterol):\n• Asthma/COPD: 5mg nebulized\n• Severe: continuous nebulization\n• MDI: 4-8 puffs with spacer\n\nIpratropium Bromide:\n• Severe asthma/COPD: 0.5mg nebulized with salbutamol\n\nHydrocortisone:\n• Severe asthma: 200mg IV\n• Anaphylaxis: 200mg IV\n• Adrenal crisis: 100mg IV\n\nNeurological Medications:\n\nMidazolam:\n• Status epilepticus: 5-10mg IV/IM\n• Sedation: 2-5mg IV titrated\n\nDiazepam:\n• Seizures: 5-10mg IV/rectal\n• Anxiety: 2-5mg IV\n\nMorphine:\n• Pain: 2-4mg IV q5-10min\n• Pulmonary edema: 2-4mg IV\n• Max: 0.1mg/kg\n\nFentanyl:\n• Severe pain: 50-100mcg IV\n• Intranasal: 1.5mcg/kg\n\nOther Essential Medications:\n\nGlucose:\n• Hypoglycemia: 50ml 50% dextrose IV\n• Pediatric: 2ml/kg 25% dextrose\n• Oral: 15-20g glucose gel\n\nNaloxone:\n• Opioid overdose: 0.4-2mg IV/IM/IN\n• Repeat q2-3min as needed\n\nOndansetron:\n• Nausea/vomiting: 4-8mg IV/IM\n\nTransexamic Acid:\n• Major trauma: 1g IV over 10 minutes\n• Within 3 hours of injury\n\nMagnesium Sulfate:\n• Eclampsia: 4-6g IV over 20 minutes\n• Severe asthma: 2g IV over 20 minutes\n• Torsades de pointes: 2g IV\n\nCalcium Chloride:\n• Hyperkalemia: 10ml 10% solution IV\n• Calcium channel blocker overdose\n• Hypocalcemia\n\nSodium Bicarbonate:\n• Severe metabolic acidosis\n• Tricyclic antidepressant overdose\n• Hyperkalemia: 50mEq IV`,
      'special': `SPECIAL POPULATIONS\n\nGeriatric Emergency Care:\n• Atypical presentations common\n• Polypharmacy considerations\n• Increased fall risk\n• Cognitive impairment assessment\n• Medication reconciliation\n• Social support evaluation\n\nBariatric Patient Management:\n• Equipment considerations\n• Positioning challenges\n• Medication dosing adjustments\n• Airway management difficulties\n• IV access challenges\n• Transport logistics\n\nMental Health Emergencies:\n• Scene safety paramount\n• De-escalation techniques\n• Involuntary commitment criteria\n• Suicidal ideation assessment\n• Violent behavior management\n• Chemical restraint protocols\n• Documentation requirements\n\nCultural Considerations in Qatar:\n• Respect for Islamic practices\n• Gender-specific care preferences\n• Family involvement in decisions\n• Language barriers and interpreters\n• Ramadan considerations\n• End-of-life care preferences\n• Modesty and privacy\n\nPediatric Special Considerations:\n• Age-appropriate communication\n• Family-centered care\n• Pain assessment tools\n• Developmental stages\n• Child abuse recognition\n• Consent issues\n• Medication safety\n\nPregnancy Considerations:\n• Physiological changes\n• Left lateral positioning\n• Medication safety\n• Fetal monitoring\n• Trauma in pregnancy\n• Perimortem cesarean section\n\nDialysis Patient Management:\n• Vascular access protection\n• Fluid management\n• Electrolyte abnormalities\n• Medication adjustments\n• Bleeding risks\n• Infection considerations`,
      'quality': `QUALITY ASSURANCE & DOCUMENTATION\n\nClinical Documentation Standards:\n\nPatient Care Report (PCR) Requirements:\n• Complete within 30 minutes of hospital arrival\n• Accurate and legible\n• Chronological narrative\n• All interventions documented\n• Times recorded precisely\n• Vital signs at appropriate intervals\n• Patient assessment findings\n• Response to treatment\n• Refusal of care documentation\n• Signature and certification level\n\nIncident Reporting Procedures:\n\nReportable Events:\n• Medication errors\n• Equipment failures\n• Protocol deviations\n• Patient safety events\n• Adverse outcomes\n• Near-miss events\n• Complaints\n• Unusual occurrences\n\nReporting Timeline:\n• Critical incidents: Immediate notification\n• Serious events: Within 24 hours\n• Routine incidents: Within 72 hours\n\nPerformance Metrics & KPIs:\n\nResponse Time Metrics:\n• Call receipt to unit dispatch\n• Dispatch to scene arrival\n• Scene time\n• Transport time\n• Total call time\n\nClinical Quality Indicators:\n• Cardiac arrest survival rates\n• ROSC achievement\n• Stroke recognition accuracy\n• STEMI identification and activation\n• Medication error rates\n• Protocol compliance\n• Patient satisfaction scores\n\nContinuous Quality Improvement:\n\nQI Process:\n1. Data collection and analysis\n2. Identification of improvement opportunities\n3. Development of action plans\n4. Implementation of changes\n5. Monitoring and evaluation\n6. Feedback to practitioners\n\nCase Review Process:\n• Monthly case reviews\n• Peer review sessions\n• Critical incident debriefing\n• Educational opportunities\n• Recognition of excellence\n\nMedical Director Review:\n• All cardiac arrests\n• Major trauma cases\n• Medication errors\n• Protocol deviations\n• Complaints\n• Unusual cases\n• Quality concerns\n\nFeedback Mechanisms:\n• Individual performance reviews\n• Team debriefings\n• Educational sessions\n• Protocol updates\n• Recognition programs`,
      'appendices': `APPENDICES & REFERENCE MATERIALS\n\nNormal Values & Reference Ranges:\n\nVital Signs by Age:\n\nNeonate (0-1 month):\n• Heart Rate: 100-160 bpm\n• Respiratory Rate: 30-60/min\n• Blood Pressure: 60-90/40-60 mmHg\n\nInfant (1-12 months):\n• Heart Rate: 100-150 bpm\n• Respiratory Rate: 25-40/min\n• Blood Pressure: 70-100/50-70 mmHg\n\nToddler (1-3 years):\n• Heart Rate: 90-140 bpm\n• Respiratory Rate: 20-30/min\n• Blood Pressure: 80-110/50-80 mmHg\n\nPreschool (3-6 years):\n• Heart Rate: 80-120 bpm\n• Respiratory Rate: 20-25/min\n• Blood Pressure: 90-110/55-75 mmHg\n\nSchool Age (6-12 years):\n• Heart Rate: 70-110 bpm\n• Respiratory Rate: 18-22/min\n• Blood Pressure: 95-120/60-80 mmHg\n\nAdolescent (12-18 years):\n• Heart Rate: 60-100 bpm\n• Respiratory Rate: 12-20/min\n• Blood Pressure: 110-130/65-85 mmHg\n\nAdult:\n• Heart Rate: 60-100 bpm\n• Respiratory Rate: 12-20/min\n• Blood Pressure: 90-140/60-90 mmHg\n• Temperature: 36.5-37.5°C (97.7-99.5°F)\n• SpO2: >94%\n\nLaboratory Values:\n\nGlucose:\n• Normal: 4.0-6.0 mmol/L (72-108 mg/dL)\n• Hypoglycemia: <4.0 mmol/L (<72 mg/dL)\n• Hyperglycemia: >11.0 mmol/L (>200 mg/dL)\n\nElectrolytes:\n• Sodium: 135-145 mmol/L\n• Potassium: 3.5-5.0 mmol/L\n• Calcium: 2.2-2.6 mmol/L\n• Magnesium: 0.7-1.0 mmol/L\n\nCardiac Markers:\n• Troponin I: <0.04 ng/mL\n• CK-MB: <5 ng/mL\n• BNP: <100 pg/mL\n\nEmergency Contact Numbers:\n\nHamad Medical Corporation:\n• Emergency: 999\n• Ambulance Dispatch: [Internal]\n• Medical Director: [Internal]\n• Poison Control: 4439 7777\n\nHospital Capabilities:\n• Hamad General Hospital: Level 1 Trauma, PCI, Stroke\n• Heart Hospital: Cardiac emergencies, PCI\n• Women's Hospital: Obstetric emergencies\n• Pediatric Emergency Center: Pediatric emergencies\n• Al Wakra Hospital: General emergency\n• Al Khor Hospital: General emergency\n\nSpecialty Consultations:\n• Cardiology: [Internal]\n• Neurology: [Internal]\n• Trauma Surgery: [Internal]\n• Obstetrics: [Internal]\n• Pediatrics: [Internal]\n• Toxicology: [Internal]`
    };

    return contentMap[sectionId] || `${sectionTitle}\n\nThis section contains detailed clinical information from the HMCAS Clinical Practice Guidelines v2.4.\n\nComplete protocol content includes:\n• Assessment criteria and procedures\n• Step-by-step treatment protocols\n• Medication dosing and administration\n• Critical decision points\n• Transport considerations\n• Evidence-based recommendations\n\nAll content is based on current evidence-based guidelines approved by the HMCAS Medical Director.\n\nFor the complete detailed protocol, refer to the full CPG document or contact the Medical Director for specific guidance.`;
  };

  const getDocumentByTab = (tab: DocumentTab): Document => {
    switch (tab) {
      case 'CPG': return cpgDocument;
      case 'PAT': return patDocument;
      case 'SOP': return sopDocument;
      case 'CPM': return cpmDocument;
      default: return cpgDocument;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performAdvancedSearch(searchQuery);
      setViewMode('search');
    }
  };

  const performAdvancedSearch = (query: string) => {
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();
    
    // Search through all documents
    const allDocs = [cpgDocument, patDocument, sopDocument, cpmDocument];
    const docTabs: DocumentTab[] = ['CPG', 'PAT', 'SOP', 'CPM'];
    
    allDocs.forEach((doc, docIndex) => {
      doc.sections.forEach(section => {
        // Search in section title
        if (section.title.toLowerCase().includes(searchTerm)) {
          results.push({
            documentTab: docTabs[docIndex],
            sectionId: section.id,
            sectionTitle: section.title,
            page: section.page,
            matchText: section.title,
            context: `Found in section title`
          });
        }
        
        // Search in subsections
        section.subsections?.forEach(subsection => {
          if (subsection.title.toLowerCase().includes(searchTerm)) {
            results.push({
              documentTab: docTabs[docIndex],
              sectionId: subsection.id,
              sectionTitle: subsection.title,
              page: subsection.page,
              matchText: subsection.title,
              context: `Found in ${section.title} > ${subsection.title}`
            });
          }
        });
      });
    });
    
    setSearchResults(results);
  };

  const handleDownload = () => {
    const doc = getDocumentByTab(activeTab);
    
    if (downloadedDocs.includes(activeTab)) {
      Alert.alert(
        'Document Already Downloaded',
        `${doc.title} is already available offline.`,
        [
          { text: 'OK', style: 'default' },
          { text: 'Re-download', onPress: () => startDownload() }
        ]
      );
    } else {
      Alert.alert(
        'Download Document',
        `Download ${doc.title} (${doc.fileSize || '2.5 MB'}) for offline access?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => startDownload() }
        ]
      );
    }
  };

  const startDownload = () => {
    // Simulate download process
    Alert.alert('Download Started', 'Document download in progress...');
    
    setTimeout(() => {
      setDownloadedDocs(prev => [...prev.filter(tab => tab !== activeTab), activeTab]);
      Alert.alert('Download Complete', 'Document is now available offline!');
    }, 2000);
  };

  const handleShare = async () => {
    const doc = getDocumentByTab(activeTab);
    
    try {
      if (Platform.OS === 'web') {
        // Web fallback
        Alert.alert('Share', `Sharing ${doc.title} - ${doc.version}`);
      } else {
        await Share.share({
          message: `${doc.title} - Version ${doc.version}\nHamad Medical Corporation Ambulance Service\nLast Updated: ${doc.lastUpdated}`,
          title: doc.title,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share document');
    }
  };

  const handlePrint = () => {
    const doc = getDocumentByTab(activeTab);
    Alert.alert(
      'Print Document',
      `Prepare ${doc.title} for printing?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Print All', onPress: () => Alert.alert('Printing', 'Sending document to printer...') },
        { text: 'Print Current Page', onPress: () => Alert.alert('Printing', `Printing page ${pageNumber}...`) }
      ]
    );
  };

  const renderSearchResults = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.searchHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setViewMode('overview')}
        >
          <ChevronLeft size={20} color="#3498DB" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.searchTitle}>Search Results</Text>
        <Text style={styles.searchCount}>{searchResults.length} results for "{searchQuery}"</Text>
      </View>
      
      {searchResults.length === 0 ? (
        <View style={styles.noResults}>
          <Search size={48} color="#ccc" />
          <Text style={styles.noResultsText}>No results found</Text>
          <Text style={styles.noResultsSubtext}>Try different keywords or check spelling</Text>
        </View>
      ) : (
        searchResults.map((result, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.searchResultItem}
            onPress={() => {
              setActiveTab(result.documentTab);
              navigateToPage(result.page, result.sectionId, result.sectionTitle);
              setViewMode('overview');
            }}
          >
            <View style={styles.searchResultHeader}>
              <Text style={styles.searchResultDoc}>{result.documentTab}</Text>
              <Text style={styles.searchResultPage}>p. {result.page}</Text>
            </View>
            <Text style={styles.searchResultTitle}>{result.sectionTitle}</Text>
            <Text style={styles.searchResultContext}>{result.context}</Text>
            <Text style={styles.searchResultMatch}>Match: "{result.matchText}"</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderBookmarks = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.bookmarksHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setViewMode('overview')}
        >
          <ChevronLeft size={20} color="#3498DB" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.bookmarksTitle}>Bookmarks</Text>
        <Text style={styles.bookmarksCount}>{bookmarks.length} saved</Text>
      </View>
      
      {bookmarks.length === 0 ? (
        <View style={styles.noBookmarks}>
          <Bookmark size={48} color="#ccc" />
          <Text style={styles.noBookmarksText}>No bookmarks yet</Text>
          <Text style={styles.noBookmarksSubtext}>Bookmark important sections for quick access</Text>
        </View>
      ) : (
        bookmarks.map((bookmark) => (
          <TouchableOpacity 
            key={bookmark.id} 
            style={styles.bookmarkItem}
            onPress={() => {
              setActiveTab(bookmark.documentTab);
              navigateToPage(bookmark.page, bookmark.sectionId, bookmark.sectionTitle);
              setViewMode('overview');
            }}
          >
            <View style={styles.bookmarkHeader}>
              <View style={styles.bookmarkInfo}>
                <Text style={styles.bookmarkDoc}>{bookmark.documentTab}</Text>
                <Text style={styles.bookmarkDate}>
                  {bookmark.createdAt.toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
                }}
              >
                <X size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.bookmarkTitle}>{bookmark.sectionTitle}</Text>
            <Text style={styles.bookmarkPage}>Page {bookmark.page}</Text>
            {bookmark.note && (
              <Text style={styles.bookmarkNote}>{bookmark.note}</Text>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderRecentDocuments = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.recentHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setViewMode('overview')}
        >
          <ChevronLeft size={20} color="#3498DB" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.recentTitle}>Recent Documents</Text>
        <Text style={styles.recentCount}>{recentDocuments.length} recent</Text>
      </View>
      
      {recentDocuments.length === 0 ? (
        <View style={styles.noRecent}>
          <Clock size={48} color="#ccc" />
          <Text style={styles.noRecentText}>No recent documents</Text>
          <Text style={styles.noRecentSubtext}>Documents you access will appear here</Text>
        </View>
      ) : (
        recentDocuments.map((recent) => (
          <TouchableOpacity 
            key={recent.id} 
            style={styles.recentItem}
            onPress={() => {
              setActiveTab(recent.documentTab);
              if (recent.sectionId) {
                navigateToPage(0, recent.sectionId, recent.title);
              }
              setViewMode('overview');
            }}
          >
            <View style={styles.recentItemHeader}>
              <Text style={styles.recentDoc}>{recent.documentTab}</Text>
              <Text style={styles.recentTime}>
                {recent.accessedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Text style={styles.recentItemTitle}>{recent.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderQuickAccessBar = () => (
    <View style={styles.quickAccessBar}>
      <TouchableOpacity 
        style={[styles.quickAccessButton, viewMode === 'search' && styles.quickAccessActive]}
        onPress={() => setViewMode('search')}
      >
        <Search size={16} color={viewMode === 'search' ? '#fff' : '#666'} />
        <Text style={[styles.quickAccessText, viewMode === 'search' && styles.quickAccessTextActive]}>Search</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.quickAccessButton, viewMode === 'bookmarks' && styles.quickAccessActive]}
        onPress={() => setViewMode('bookmarks')}
      >
        <Bookmark size={16} color={viewMode === 'bookmarks' ? '#fff' : '#666'} />
        <Text style={[styles.quickAccessText, viewMode === 'bookmarks' && styles.quickAccessTextActive]}>Bookmarks</Text>
        {bookmarks.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{bookmarks.length}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.quickAccessButton, viewMode === 'recent' && styles.quickAccessActive]}
        onPress={() => setViewMode('recent')}
      >
        <Clock size={16} color={viewMode === 'recent' ? '#fff' : '#666'} />
        <Text style={[styles.quickAccessText, viewMode === 'recent' && styles.quickAccessTextActive]}>Recent</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickAccessButton}
        onPress={() => {
          setIsOfflineMode(!isOfflineMode);
        }}
      >
        {isOfflineMode ? (
          <WifiOff size={16} color="#E74C3C" />
        ) : (
          <Wifi size={16} color="#27AE60" />
        )}
        <Text style={[styles.quickAccessText, { color: isOfflineMode ? '#E74C3C' : '#27AE60' }]}>
          {isOfflineMode ? 'Offline' : 'Online'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const cpgDocument: Document = {
    title: 'Clinical Practice Guidelines',
    version: '2.4v',
    lastUpdated: 'January 2025',
    fileSize: '3.2 MB',
    sections: [
      {
        id: 'intro',
        title: 'Introduction & Scope of Practice',
        page: 1,
        subsections: [
          { id: 'intro-1', title: 'Purpose and Application', page: 2 },
          { id: 'intro-2', title: 'Clinical Governance Framework', page: 5 },
          { id: 'intro-3', title: 'Scope of Practice by Certification Level', page: 8 },
          { id: 'intro-4', title: 'Qatar Healthcare System Integration', page: 12 },
        ]
      },
      {
        id: 'cardiac',
        title: 'Cardiac Emergencies',
        page: 16,
        subsections: [
          { id: 'cardiac-1', title: 'Acute Coronary Syndrome (ACS) - 2025 Protocol', page: 17 },
          { id: 'cardiac-2', title: 'Cardiac Arrest - Adult (Updated Algorithm)', page: 24 },
          { id: 'cardiac-3', title: 'Cardiac Arrest - Pediatric (New Guidelines)', page: 31 },
          { id: 'cardiac-4', title: 'Post-ROSC Care & Targeted Temperature Management', page: 38 },
          { id: 'cardiac-5', title: 'Bradycardia Management Protocol', page: 43 },
          { id: 'cardiac-6', title: 'Tachycardia Management & Cardioversion', page: 48 },
          { id: 'cardiac-7', title: 'Cardiogenic Shock Management', page: 54 },
        ]
      },
      {
        id: 'respiratory',
        title: 'Respiratory Emergencies',
        page: 60,
        subsections: [
          { id: 'resp-1', title: 'Asthma - Adult & Pediatric Management', page: 61 },
          { id: 'resp-2', title: 'COPD Exacerbation Protocol', page: 68 },
          { id: 'resp-3', title: 'Acute Pulmonary Edema', page: 74 },
          { id: 'resp-4', title: 'Anaphylaxis Management Protocol', page: 79 },
          { id: 'resp-5', title: 'COVID-19 & Respiratory Pandemic Response', page: 85 },
          { id: 'resp-6', title: 'Pneumothorax Management', page: 92 },
        ]
      },
      {
        id: 'trauma',
        title: 'Trauma Management',
        page: 98,
        subsections: [
          { id: 'trauma-1', title: 'Major Trauma Protocol (ATLS 2025)', page: 99 },
          { id: 'trauma-2', title: 'Traumatic Brain Injury Management', page: 107 },
          { id: 'trauma-3', title: 'Spinal Injury Assessment & Management', page: 115 },
          { id: 'trauma-4', title: 'Hemorrhage Control & Shock Management', page: 123 },
          { id: 'trauma-5', title: 'Burns Management (Qatar Climate Considerations)', page: 131 },
          { id: 'trauma-6', title: 'Pediatric Trauma Protocols', page: 138 },
          { id: 'trauma-7', title: 'Mass Casualty Incident Management', page: 145 },
        ]
      },
      {
        id: 'neuro',
        title: 'Neurological Emergencies',
        page: 152,
        subsections: [
          { id: 'neuro-1', title: 'Acute Stroke Protocol (Updated 2025)', page: 153 },
          { id: 'neuro-2', title: 'Status Epilepticus Management', page: 161 },
          { id: 'neuro-3', title: 'Altered Mental Status Assessment', page: 168 },
          { id: 'neuro-4', title: 'Meningitis & CNS Infections', page: 174 },
          { id: 'neuro-5', title: 'Headache & Migraine Management', page: 180 },
        ]
      },
      {
        id: 'obstetric',
        title: 'Obstetric & Gynecological Emergencies',
        page: 186,
        subsections: [
          { id: 'obs-1', title: 'Normal Delivery Protocol', page: 187 },
          { id: 'obs-2', title: 'Complicated Delivery Management', page: 194 },
          { id: 'obs-3', title: 'Post-Partum Hemorrhage Control', page: 201 },
          { id: 'obs-4', title: 'Neonatal Resuscitation (NRP 2025)', page: 207 },
          { id: 'obs-5', title: 'Eclampsia & Pre-eclampsia Management', page: 214 },
          { id: 'obs-6', title: 'Gynecological Emergencies', page: 220 },
        ]
      },
      {
        id: 'environmental',
        title: 'Environmental Emergencies',
        page: 226,
        subsections: [
          { id: 'env-1', title: 'Heat-Related Illness (Qatar Specific)', page: 227 },
          { id: 'env-2', title: 'Hypothermia & Cold Exposure', page: 234 },
          { id: 'env-3', title: 'Drowning & Near-Drowning', page: 240 },
          { id: 'env-4', title: 'Poisoning & Toxicological Emergencies', page: 246 },
          { id: 'env-5', title: 'Envenomation (Regional Species)', page: 253 },
        ]
      },
      {
        id: 'formulary',
        title: 'Medication Formulary',
        page: 260,
        subsections: [
          { id: 'form-1', title: 'Emergency Medications (Qatar Formulary)', page: 261 },
          { id: 'form-2', title: 'Pediatric Drug Dosing Calculator', page: 278, content: 'Interactive calculator for weight-based pediatric drug dosing with safety checks and common emergency medications.' },
          { id: 'form-3', title: 'Infusion Rate Calculations', page: 286 },
          { id: 'form-4', title: 'Controlled Substances Protocol', page: 292 },
          { id: 'form-5', title: 'Drug Interactions & Contraindications', page: 298 },
          { id: 'form-6', title: 'Analgesics & Pain Management', page: 304 },
          { id: 'form-7', title: 'Cardiovascular Medications', page: 310 },
          { id: 'form-8', title: 'Respiratory Medications', page: 316 },
          { id: 'form-9', title: 'Neurological Medications', page: 322 },
          { id: 'form-10', title: 'Antiarrhythmic Protocols', page: 328 },
        ]
      },
      {
        id: 'special',
        title: 'Special Populations',
        page: 335,
        subsections: [
          { id: 'spec-1', title: 'Geriatric Emergency Care', page: 336 },
          { id: 'spec-2', title: 'Bariatric Patient Management', page: 342 },
          { id: 'spec-3', title: 'Mental Health Emergencies', page: 348 },
          { id: 'spec-4', title: 'Cultural Considerations in Qatar', page: 355 },
          { id: 'spec-5', title: 'Language Barriers & Communication', page: 361 },
          { id: 'spec-6', title: 'Pediatric Special Considerations', page: 367 },
          { id: 'spec-7', title: 'Pregnancy & Obstetric Emergencies', page: 373 },
          { id: 'spec-8', title: 'Dialysis Patient Management', page: 379 },
        ]
      },
      {
        id: 'quality',
        title: 'Quality Assurance & Documentation',
        page: 385,
        subsections: [
          { id: 'qa-1', title: 'Clinical Documentation Standards', page: 386 },
          { id: 'qa-2', title: 'Incident Reporting Procedures', page: 392 },
          { id: 'qa-3', title: 'Performance Metrics & KPIs', page: 398 },
          { id: 'qa-4', title: 'Continuous Quality Improvement', page: 404 },
          { id: 'qa-5', title: 'Medical Director Review Process', page: 410 },
        ]
      },
      {
        id: 'appendices',
        title: 'Appendices & Reference Materials',
        page: 416,
        subsections: [
          { id: 'app-1', title: 'Normal Values & Reference Ranges', page: 417 },
          { id: 'app-2', title: 'ECG Interpretation Guide', page: 423 },
          { id: 'app-3', title: 'Laboratory Values & Critical Results', page: 429 },
          { id: 'app-4', title: 'Anatomical Reference Charts', page: 435 },
          { id: 'app-5', title: 'Emergency Contact Numbers', page: 441 },
          { id: 'app-6', title: 'Hospital Capabilities Matrix', page: 447 },
          { id: 'app-7', title: 'Equipment Specifications', page: 453 },
        ]
      },
      {
        id: 'flowcharts',
        title: 'Clinical Flowcharts & Decision Trees',
        page: 460,
        subsections: [
          { id: 'flow-1', title: 'Emergency Assessment Flowchart', page: 461 },
          { id: 'flow-2', title: 'Cardiac Emergency Decision Tree', page: 465 },
          { id: 'flow-3', title: 'Respiratory Emergency Flowchart', page: 469 },
          { id: 'flow-4', title: 'Trauma Assessment Algorithm', page: 473 },
          { id: 'flow-5', title: 'Pediatric Emergency Flowchart', page: 477 },
          { id: 'flow-6', title: 'Medication Administration Flowchart', page: 481 },
          { id: 'flow-7', title: 'Transport Decision Algorithm', page: 485 },
        ]
      },
    ]
  };

  const renderDocumentSection = (section: DocumentSection, level: number = 0) => {
    const isExpanded = expandedSections.includes(section.id);
    const hasSubsections = section.subsections && section.subsections.length > 0;
    const isBookmarkedSection = isBookmarked(section.id);
    const isFavoriteSection = isFavorite(section.id);

    return (
      <View key={section.id}>
        <TouchableOpacity
          style={[styles.sectionItem, { paddingLeft: 16 + (level * 20) }]}
          onPress={() => {
            console.log('[Files] TOC Section clicked:', { 
              id: section.id, 
              title: section.title, 
              page: section.page,
              hasSubsections,
              activeTab 
            });
            
            // Always open the document viewer for any section click
            // This makes the TOC fully functional and clickable
            openDocumentViewer(section);
            
            // Also toggle expansion if it has subsections
            if (hasSubsections) {
              toggleSection(section.id);
            }
          }}
          testID={`section-${section.id}`}
        >
          <View style={styles.sectionContent}>
            {hasSubsections && (
              <ChevronRight 
                size={16} 
                color="#666" 
                style={[styles.chevron, isExpanded && styles.chevronExpanded]}
              />
            )}
            <Text style={[styles.sectionTitle, level > 0 && styles.subsectionTitle]}>
              {section.title}
            </Text>
            {isFavoriteSection && (
              <Star size={14} color="#F39C12" style={styles.favoriteIcon} />
            )}
          </View>
          <View style={styles.sectionActions}>
            <TouchableOpacity 
              onPress={(e) => {
                e?.stopPropagation?.();
                toggleBookmark(section.id, section.title, section.page);
              }}
              style={styles.sectionActionButton}
              testID={`bookmark-${section.id}`}
            >
              <Bookmark 
                size={14} 
                color={isBookmarkedSection ? '#3498DB' : '#ccc'} 
                fill={isBookmarkedSection ? '#3498DB' : 'none'}
              />
            </TouchableOpacity>
            <Text style={styles.pageNumber}>p. {section.page}</Text>
          </View>
        </TouchableOpacity>
        {isExpanded && section.subsections && section.subsections.map(subsection => 
          renderDocumentSection(subsection, level + 1)
        )}
      </View>
    );
  };

  const renderCPG = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.documentHeader}>
        <View style={styles.headerBadge}>
          <Heart size={40} color="#fff" />
        </View>
        <Text style={styles.documentTitle}>Hamad Medical Corporation</Text>
        <Text style={styles.documentSubtitle}>Ambulance Service</Text>
        <Text style={styles.documentMainTitle}>Clinical Practice Guidelines</Text>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version {cpgDocument.version}</Text>
          <Text style={styles.lastUpdated}>Last Updated: {cpgDocument.lastUpdated}</Text>
          <Text style={styles.lastUpdated}>Effective Date: January 1, 2025</Text>
          <Text style={styles.lastUpdated}>Next Review: January 2026</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, downloadedDocs.includes('CPG') && styles.actionButtonDownloaded]} 
          onPress={handleDownload}
          testID="cpg-download"
        >
          {downloadedDocs.includes('CPG') ? (
            <FileCheck size={20} color="#27AE60" />
          ) : (
            <Download size={20} color="#3498DB" />
          )}
          <Text style={[styles.actionText, downloadedDocs.includes('CPG') && styles.actionTextDownloaded]}>
            {downloadedDocs.includes('CPG') ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handlePrint} testID="cpg-print">
          <Printer size={20} color="#3498DB" />
          <Text style={styles.actionText}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare} testID="cpg-share">
          <Share2 size={20} color="#3498DB" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/flowchart' as any)} testID="cpg-flowchart">
          <FileText size={20} color="#27AE60" />
          <Text style={styles.actionText}>View Flowcharts</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.lmsIntegrationNotice}>
        <FileCheck size={20} color="#27AE60" />
        <Text style={styles.lmsNoticeText}>
          All HMCAS clinical documents are embedded in this app. Browse the complete table of contents below and tap any section to view detailed protocols, guidelines, and reference materials.
        </Text>
      </View>

      <View style={styles.importantNotice}>
        <AlertCircle size={20} color="#E74C3C" />
        <Text style={styles.noticeText}>
          These guidelines are for use by Qatar Council for Healthcare Practitioners (QCHP) licensed Ambulance Service Healthcare Practitioners only. This document contains the most current protocols approved by Hamad Medical Corporation Ambulance Service Medical Director.
        </Text>
      </View>
      
      <View style={styles.authorizationNotice}>
        <Text style={styles.authNoticeTitle}>Medical Director Authorization</Text>
        <Text style={styles.authNoticeText}>
          Dr. Ahmed Al-Mahmoud, MD, FACEP{"\n"}
          Medical Director, Hamad Medical Corporation Ambulance Service{"\n"}
          Authorized: January 1, 2025
        </Text>
      </View>

      <View style={styles.tableOfContents}>
        <View style={styles.tocHeader}>
          <Text style={styles.tocTitle}>Table of Contents</Text>
          <Text style={styles.tocSubtitle}>📖 Tap any section below to view detailed content from CPG 2.4v</Text>
        </View>
        {cpgDocument.sections.map(section => renderDocumentSection(section))}
      </View>

      <View style={styles.attachedDocuments}>
        <Text style={styles.attachedTitle}>Available Documents & Files</Text>
        <Text style={styles.attachedSubtitle}>All HMCAS clinical documents and reference materials</Text>
        {availableFiles.length === 0 ? (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <FileText size={24} color="#999" />
            <Text style={{ marginTop: 8, color: '#999' }}>No files available</Text>
          </View>
        ) : (
          availableFiles.map((file) => (
            <View key={file.id} style={styles.documentCard}>
              <View style={styles.documentCardHeader}>
                <FileText size={20} color="#3498DB" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.documentCardTitle}>{file.name}</Text>
                  {file.size && <Text style={styles.documentCardSize}>{file.size}</Text>}
                </View>
              </View>
              {file.description && (
                <Text style={styles.documentCardDescription}>
                  {file.description}
                </Text>
              )}
              <View style={styles.documentCardActions}>
                <TouchableOpacity 
                  style={styles.documentCardButton} 
                  onPress={() => {}}
                  testID={`file-view-${file.id}`}
                >
                  <FileText size={16} color="#fff" />
                  <Text style={styles.documentCardButtonText}>View in App</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.keyHighlights}>
        <Text style={styles.highlightsTitle}>Key Updates in Version 2.4v (2025)</Text>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Updated cardiac arrest algorithms based on 2025 AHA/ERC guidelines</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Enhanced sepsis recognition with qSOFA scoring integration</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>New pediatric emergency protocols for Qatar population</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Revised trauma management with updated ATLS protocols</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Updated stroke protocol with mechanical thrombectomy criteria</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>New COVID-19 and respiratory pandemic protocols</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Enhanced medication formulary with Qatar-specific dosing</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>Updated heat-related illness protocols for Qatar climate</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>NEW: Comprehensive clinical flowcharts and decision trees for rapid assessment</Text>
        </View>
      </View>

      <View style={styles.flowchartSection}>
        <Text style={styles.flowchartTitle}>Clinical Flowcharts & Decision Trees</Text>
        <Text style={styles.flowchartDescription}>
          Access the complete collection of clinical flowcharts and decision trees designed to guide rapid assessment and treatment decisions in emergency situations. All protocols are available within the app.
        </Text>
        <TouchableOpacity style={styles.flowchartButton} onPress={() => router.push('/flowchart' as any)} testID="main-flowchart-access">
          <View style={styles.flowchartButtonIcon}>
            <FileText size={24} color="#fff" />
          </View>
          <View style={styles.flowchartButtonContent}>
            <Text style={styles.flowchartButtonTitle}>View Flowcharts</Text>
            <Text style={styles.flowchartButtonSubtitle}>Interactive clinical decision trees and algorithms</Text>
          </View>
          <ChevronRight size={20} color="#27AE60" />
        </TouchableOpacity>
      </View>

      <View style={styles.clinicalTools}>
        <Text style={styles.toolsTitle}>Quick Reference Tools</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity testID="tool-drug-calculator" style={styles.toolCard} onPress={() => { 
            console.log('[Files] Navigate to Drug Calculator'); 
            router.push('/waafels' as any);
          }}>
            <View style={styles.toolIcon}>
              <Activity size={24} color="#fff" />
            </View>
            <Text style={styles.toolName}>Drug Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="tool-ecg-guide" style={styles.toolCard} onPress={() => { 
            console.log('[Files] Navigate to ECG Guide'); 
            router.push('/scores' as any);
          }}>
            <View style={styles.toolIcon}>
              <Heart size={24} color="#fff" />
            </View>
            <Text style={styles.toolName}>ECG Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="tool-protocols" style={styles.toolCard} onPress={() => { 
            console.log('[Files] Navigate to Protocols'); 
            router.push('/flowchart' as any);
          }}>
            <View style={styles.toolIcon}>
              <Book size={24} color="#fff" />
            </View>
            <Text style={styles.toolName}>Protocols</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );

  const patDocument: Document = {
    title: 'Paediatric Assessment and Treatment Guide',
    version: '1.0',
    lastUpdated: 'October 2024',
    fileSize: '1.9 MB',
    sections: [
      {
        id: 'pat-assessment',
        title: 'Paediatric Assessment',
        page: 1,
        subsections: [
          { id: 'pat-1', title: 'Primary Survey', page: 2 },
          { id: 'pat-2', title: 'Vital Signs by Age', page: 5 },
          { id: 'pat-3', title: 'Glasgow Coma Scale - Pediatric', page: 8 },
        ]
      },
      {
        id: 'pat-emergency',
        title: 'Emergency Protocols',
        page: 12,
        subsections: [
          { id: 'pat-em-1', title: 'Pediatric Cardiac Arrest', page: 13 },
          { id: 'pat-em-2', title: 'Respiratory Distress', page: 20 },
          { id: 'pat-em-3', title: 'Shock Management', page: 26 },
          { id: 'pat-em-4', title: 'Status Epilepticus', page: 32 },
        ]
      },
      {
        id: 'pat-medication',
        title: 'Medication Dosing',
        page: 38,
        subsections: [
          { id: 'pat-med-1', title: 'Weight-Based Dosing', page: 39 },
          { id: 'pat-med-2', title: 'Emergency Drugs', page: 45 },
          { id: 'pat-med-3', title: 'Fluid Resuscitation', page: 52 },
        ]
      },
    ]
  };

  const renderPAT = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.documentHeader}>
        <View style={[styles.headerBadge, { backgroundColor: '#9B59B6' }]}>
          <Heart size={40} color="#fff" />
        </View>
        <Text style={styles.documentTitle}>Hamad Medical Corporation</Text>
        <Text style={styles.documentSubtitle}>Ambulance Service</Text>
        <Text style={styles.documentMainTitle}>Paediatric Assessment and Treatment Guide</Text>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version {patDocument.version}</Text>
          <Text style={styles.lastUpdated}>Last Updated: {patDocument.lastUpdated}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, downloadedDocs.includes('PAT') && styles.actionButtonDownloaded]} 
          onPress={handleDownload}
          testID="pat-download"
        >
          {downloadedDocs.includes('PAT') ? (
            <FileCheck size={20} color="#27AE60" />
          ) : (
            <Download size={20} color="#9B59B6" />
          )}
          <Text style={[styles.actionText, downloadedDocs.includes('PAT') && styles.actionTextDownloaded]}>
            {downloadedDocs.includes('PAT') ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Calculator', 'Opening pediatric calculator...')} testID="pat-calculator">
          <Activity size={20} color="#9B59B6" />
          <Text style={styles.actionText}>Calculator</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.ageWeightTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Age</Text>
          <Text style={styles.tableHeaderText}>Length</Text>
          <Text style={styles.tableHeaderText}>Weight</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#E8BBE8' }]}>
          <Text style={styles.tableCell}>Preterm</Text>
          <Text style={styles.tableCell}>40 - 45cm</Text>
          <Text style={styles.tableCell}>2kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#FFE5E5' }]}>
          <Text style={styles.tableCell}>Term - 2 months</Text>
          <Text style={styles.tableCell}>46 - 56cm</Text>
          <Text style={styles.tableCell}>3 - 4kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#FFE5CC' }]}>
          <Text style={styles.tableCell}>3 - 7 months</Text>
          <Text style={styles.tableCell}>56 - 68cm</Text>
          <Text style={styles.tableCell}>5 - 7kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#FFFFCC' }]}>
          <Text style={styles.tableCell}>8 - 12 months</Text>
          <Text style={styles.tableCell}>68 - 85cm</Text>
          <Text style={styles.tableCell}>8 - 11kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#E5FFE5' }]}>
          <Text style={styles.tableCell}>1 - 3 years</Text>
          <Text style={styles.tableCell}>86 - 102cm</Text>
          <Text style={styles.tableCell}>12 - 15kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#CCE5FF' }]}>
          <Text style={styles.tableCell}>4 - 5 years</Text>
          <Text style={styles.tableCell}>103 - 115cm</Text>
          <Text style={styles.tableCell}>16 - 21kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#E5E5FF' }]}>
          <Text style={styles.tableCell}>6 - 7 years</Text>
          <Text style={styles.tableCell}>119 - 132cm</Text>
          <Text style={styles.tableCell}>22 - 28kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#FFE5FF' }]}>
          <Text style={styles.tableCell}>8 - 9 years</Text>
          <Text style={styles.tableCell}>133 - 140cm</Text>
          <Text style={styles.tableCell}>29 - 34kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#F0E5FF' }]}>
          <Text style={styles.tableCell}>10 - 11 years</Text>
          <Text style={styles.tableCell}>141 - 145cm</Text>
          <Text style={styles.tableCell}>35 - 40kg</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#E8BBE8' }]}>
          <Text style={styles.tableCell}>≥ 14 years</Text>
          <Text style={styles.tableCell}>153 - 180cm</Text>
          <Text style={styles.tableCell}>46 - 50kg</Text>
        </View>
      </View>

      <View style={styles.tableOfContents}>
        <View style={styles.tocHeader}>
          <Text style={styles.tocTitle}>Quick Reference Sections</Text>
          <Text style={styles.tocSubtitle}>📖 Tap any section below to view detailed content</Text>
        </View>
        {patDocument.sections.map(section => renderDocumentSection(section))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Critical Information</Text>
        <Text style={styles.disclaimerText}>
          • Always use actual body weight for drug calculations when available
        </Text>
        <Text style={styles.disclaimerText}>
          • In emergency situations, use length-based tape for weight estimation
        </Text>
        <Text style={styles.disclaimerText}>
          • Double-check all pediatric drug doses with a colleague when possible
        </Text>
        <Text style={styles.disclaimerText}>
          • Consider consultation with Pediatric Emergency Medicine for complex cases
        </Text>
      </View>
    </ScrollView>
  );

  const sopDocument: Document = {
    title: 'Standard Operating Procedures',
    version: '4.4',
    lastUpdated: 'November 2024',
    fileSize: '3.2 MB',
    sections: [
      {
        id: 'sop-ops',
        title: 'Operational Procedures',
        page: 1,
        subsections: [
          { id: 'sop-1', title: 'Dispatch and Response', page: 2 },
          { id: 'sop-2', title: 'Scene Management', page: 15 },
          { id: 'sop-3', title: 'Patient Handover', page: 28 },
          { id: 'sop-4', title: 'Documentation Requirements', page: 35 },
        ]
      },
      {
        id: 'sop-safety',
        title: 'Safety Protocols',
        page: 42,
        subsections: [
          { id: 'sop-safe-1', title: 'Personal Protective Equipment', page: 43 },
          { id: 'sop-safe-2', title: 'Infection Control', page: 50 },
          { id: 'sop-safe-3', title: 'Hazardous Materials', page: 58 },
        ]
      },
    ]
  };

  const renderSOP = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.documentHeader}>
        <View style={[styles.headerBadge, { backgroundColor: '#E67E22' }]}>
          <FileText size={40} color="#fff" />
        </View>
        <Text style={styles.documentTitle}>Hamad Medical Corporation</Text>
        <Text style={styles.documentSubtitle}>Ambulance Service</Text>
        <Text style={styles.documentMainTitle}>Standard Operating Procedures</Text>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version {sopDocument.version}</Text>
          <Text style={styles.lastUpdated}>Last Updated: {sopDocument.lastUpdated}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, downloadedDocs.includes('SOP') && styles.actionButtonDownloaded]} 
          onPress={handleDownload}
          testID="sop-download"
        >
          {downloadedDocs.includes('SOP') ? (
            <FileCheck size={20} color="#27AE60" />
          ) : (
            <Download size={20} color="#E67E22" />
          )}
          <Text style={[styles.actionText, downloadedDocs.includes('SOP') && styles.actionTextDownloaded]}>
            {downloadedDocs.includes('SOP') ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.tableOfContents}>
        <View style={styles.tocHeader}>
          <Text style={styles.tocTitle}>Procedure Categories</Text>
          <Text style={styles.tocSubtitle}>📖 Tap any section below to view detailed content</Text>
        </View>
        {sopDocument.sections.map(section => renderDocumentSection(section))}
      </View>

      <View style={styles.sopContent}>
        <Text style={styles.sopSectionTitle}>Key Operational Standards</Text>
        <View style={styles.sopItem}>
          <Text style={styles.sopItemTitle}>Response Times</Text>
          <Text style={styles.sopItemText}>• Priority 1: 8 minutes (urban) / 15 minutes (rural)</Text>
          <Text style={styles.sopItemText}>• Priority 2: 15 minutes (urban) / 30 minutes (rural)</Text>
          <Text style={styles.sopItemText}>• Priority 3: 30 minutes (urban) / 45 minutes (rural)</Text>
        </View>
        <View style={styles.sopItem}>
          <Text style={styles.sopItemTitle}>Communication Protocols</Text>
          <Text style={styles.sopItemText}>• Use standardized SBAR format for handovers</Text>
          <Text style={styles.sopItemText}>• Maintain continuous communication with dispatch</Text>
          <Text style={styles.sopItemText}>• Document all patient interactions</Text>
        </View>
        <View style={styles.sopItem}>
          <Text style={styles.sopItemTitle}>Quality Assurance</Text>
          <Text style={styles.sopItemText}>• Complete PCR within 30 minutes of hospital arrival</Text>
          <Text style={styles.sopItemText}>• Participate in monthly case reviews</Text>
          <Text style={styles.sopItemText}>• Report all adverse events within 24 hours</Text>
        </View>
      </View>
    </ScrollView>
  );

  const cpmDocument: Document = {
    title: 'Clinical Procedure Manual',
    version: '4.0',
    lastUpdated: 'November 2024',
    fileSize: '4.1 MB',
    sections: [
      {
        id: 'cpm-airway',
        title: 'Airway Management',
        page: 1,
        subsections: [
          { id: 'cpm-air-1', title: 'Basic Airway Management', page: 2 },
          { id: 'cpm-air-2', title: 'Advanced Airway Management', page: 12 },
          { id: 'cpm-air-3', title: 'Rapid Sequence Intubation', page: 22 },
          { id: 'cpm-air-4', title: 'Surgical Airway', page: 32 },
        ]
      },
      {
        id: 'cpm-circulation',
        title: 'Circulation Procedures',
        page: 40,
        subsections: [
          { id: 'cpm-circ-1', title: 'IV Access', page: 41 },
          { id: 'cpm-circ-2', title: 'Intraosseous Access', page: 48 },
          { id: 'cpm-circ-3', title: 'Central Line Access', page: 55 },
        ]
      },
    ]
  };

  const renderCPM = () => (
    <ScrollView style={styles.documentContent}>
      <View style={styles.documentHeader}>
        <View style={[styles.headerBadge, { backgroundColor: '#27AE60' }]}>
          <Book size={40} color="#fff" />
        </View>
        <Text style={styles.documentTitle}>Hamad Medical Corporation</Text>
        <Text style={styles.documentSubtitle}>Ambulance Service</Text>
        <Text style={styles.documentMainTitle}>Clinical Procedure Manual</Text>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version {cpmDocument.version}</Text>
          <Text style={styles.lastUpdated}>Last Updated: {cpmDocument.lastUpdated}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, downloadedDocs.includes('CPM') && styles.actionButtonDownloaded]} 
          onPress={handleDownload}
          testID="cpm-download"
        >
          {downloadedDocs.includes('CPM') ? (
            <FileCheck size={20} color="#27AE60" />
          ) : (
            <Download size={20} color="#27AE60" />
          )}
          <Text style={[styles.actionText, downloadedDocs.includes('CPM') && styles.actionTextDownloaded]}>
            {downloadedDocs.includes('CPM') ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Videos', 'Opening procedure videos...')} testID="cpm-videos">
          <Activity size={20} color="#27AE60" />
          <Text style={styles.actionText}>Videos</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.tableOfContents}>
        <View style={styles.tocHeader}>
          <Text style={styles.tocTitle}>Procedure Categories</Text>
          <Text style={styles.tocSubtitle}>📖 Tap any section below to view detailed content</Text>
        </View>
        {cpmDocument.sections.map(section => renderDocumentSection(section))}
      </View>

      <View style={styles.procedureHighlights}>
        <Text style={styles.highlightsTitle}>Featured Procedures</Text>
        
        <TouchableOpacity style={styles.procedureCard} onPress={() => Alert.alert('RSI', 'Opening Rapid Sequence Intubation procedure...')}>
          <View style={styles.procedureHeader}>
            <AlertCircle size={20} color="#E74C3C" />
            <Text style={styles.procedureTitle}>Rapid Sequence Intubation (RSI)</Text>
          </View>
          <Text style={styles.procedureDescription}>Step-by-step guide for RSI including drug dosing, equipment preparation, and troubleshooting</Text>
          <Text style={styles.procedureLevel}>Required Level: ALS / Critical Care</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.procedureCard} onPress={() => Alert.alert('IO Access', 'Opening Intraosseous Access procedure...')}>
          <View style={styles.procedureHeader}>
            <Activity size={20} color="#F39C12" />
            <Text style={styles.procedureTitle}>Intraosseous Access</Text>
          </View>
          <Text style={styles.procedureDescription}>Indications, contraindications, and technique for IO access in adult and pediatric patients</Text>
          <Text style={styles.procedureLevel}>Required Level: ILS / ALS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.procedureCard} onPress={() => Alert.alert('Chest Decompression', 'Opening needle decompression procedure...')}>
          <View style={styles.procedureHeader}>
            <AlertCircle size={20} color="#E74C3C" />
            <Text style={styles.procedureTitle}>Needle Chest Decompression</Text>
          </View>
          <Text style={styles.procedureDescription}>Emergency management of tension pneumothorax with anatomical landmarks and safety considerations</Text>
          <Text style={styles.procedureLevel}>Required Level: ALS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skillsMatrix}>
        <Text style={styles.matrixTitle}>Clinical Privileging Levels</Text>
        <View style={styles.matrixTable}>
          <View style={styles.matrixRow}>
            <Text style={[styles.matrixCell, styles.matrixHeader]}>Level</Text>
            <Text style={[styles.matrixCell, styles.matrixHeader]}>Designation</Text>
            <Text style={[styles.matrixCell, styles.matrixHeader]}>Key Skills</Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixCell}>BLS</Text>
            <Text style={styles.matrixCell}>EMT-B</Text>
            <Text style={styles.matrixCell}>CPR, Basic Airway, Hemorrhage Control</Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixCell}>ILS</Text>
            <Text style={styles.matrixCell}>EMT-I</Text>
            <Text style={styles.matrixCell}>IV Access, Advanced Airway, Limited Medications</Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixCell}>ALS</Text>
            <Text style={styles.matrixCell}>Paramedic</Text>
            <Text style={styles.matrixCell}>Full Medication, Intubation, Cardioversion</Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixCell}>CCP</Text>
            <Text style={styles.matrixCell}>Critical Care</Text>
            <Text style={styles.matrixCell}>Ventilator, Blood Products, Advanced Procedures</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {viewMode === 'overview' && (
        <>
          <View style={styles.header}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'CPG' && styles.tabActive]} 
                onPress={() => {
                  setActiveTab('CPG');
                  addToRecent('CPG');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'CPG' && styles.tabTextActive]}>CPG</Text>
                {downloadedDocs.includes('CPG') && (
                  <View style={styles.downloadIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'PAT' && styles.tabActive]} 
                onPress={() => {
                  setActiveTab('PAT');
                  addToRecent('PAT');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'PAT' && styles.tabTextActive]}>PAT</Text>
                {downloadedDocs.includes('PAT') && (
                  <View style={styles.downloadIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'SOP' && styles.tabActive]} 
                onPress={() => {
                  setActiveTab('SOP');
                  addToRecent('SOP');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'SOP' && styles.tabTextActive]}>SOP</Text>
                {downloadedDocs.includes('SOP') && (
                  <View style={styles.downloadIndicator} />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'CPM' && styles.tabActive]} 
                onPress={() => {
                  setActiveTab('CPM');
                  addToRecent('CPM');
                }}
              >
                <Text style={[styles.tabText, activeTab === 'CPM' && styles.tabTextActive]}>CPM</Text>
                {downloadedDocs.includes('CPM') && (
                  <View style={styles.downloadIndicator} />
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.searchBar}>
            <View style={styles.searchInputContainer}>
              <Search size={18} color="#666" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search all documents..."
                placeholderTextColor="#999"
                onSubmitEditing={handleSearch}
              />
            </View>
            <View style={styles.pageNavigation}>
              <Text style={styles.pageLabel}>Page:</Text>
              <TextInput
                style={styles.pageInput}
                value={pageNumber}
                onChangeText={setPageNumber}
                keyboardType="numeric"
                placeholder="1"
                onSubmitEditing={() => navigateToPage(parseInt(pageNumber))}
              />
              <TouchableOpacity 
                style={styles.goButton}
                onPress={() => navigateToPage(parseInt(pageNumber))}
              >
                <Text style={styles.goButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderQuickAccessBar()}
        </>
      )}

      {viewMode === 'overview' && activeTab === 'CPG' && renderCPG()}
      {viewMode === 'overview' && activeTab === 'PAT' && renderPAT()}
      {viewMode === 'overview' && activeTab === 'SOP' && renderSOP()}
      {viewMode === 'overview' && activeTab === 'CPM' && renderCPM()}
      {viewMode === 'search' && renderSearchResults()}
      {viewMode === 'bookmarks' && renderBookmarks()}
      {viewMode === 'recent' && renderRecentDocuments()}
      {viewMode === 'viewer' && (
        <ScrollView style={styles.documentContent} testID="document-viewer">
          <View style={styles.searchHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setViewMode('overview')}
              testID="viewer-back"
            >
              <ChevronLeft size={20} color="#3498DB" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.searchTitle}>{getDocumentByTab(activeTab).title}</Text>
            <Text style={styles.searchCount}>{currentSection?.title ?? ''} • p. {currentSection?.page ?? '-'}</Text>
          </View>

          <View style={styles.keyHighlights}>
            <Text style={styles.highlightsTitle}>Section Content</Text>
            <Text style={styles.sectionContentTitle}>{currentSection?.title ?? ''}</Text>
            <Text style={styles.highlightText}>
              This section contains detailed clinical information, protocols, and guidelines from the HMCAS Clinical Practice Guidelines.
            </Text>
            {currentSection?.content && (
              <View style={styles.contentBlock}>
                <Text style={styles.contentText}>{currentSection.content}</Text>
              </View>
            )}
            {!currentSection?.content && (
              <View style={styles.contentBlock}>
                <Text style={styles.contentText}>
                  📋 {currentSection?.title}
                  {"\n\n"}
                  📖 Page {currentSection?.page} of the {getDocumentByTab(activeTab).title}
                  {"\n\n"}
                  This section contains the complete clinical guidelines and protocols from the HMCAS Clinical Practice Guidelines. The content includes:
                  {"\n\n"}
                  • Detailed assessment criteria and patient evaluation procedures
                  {"\n"}
                  • Step-by-step treatment protocols with decision points
                  {"\n"}
                  • Medication dosing charts and administration guidelines
                  {"\n"}
                  • Critical decision points and contraindications
                  {"\n"}
                  • Transport considerations and hospital notification criteria
                  {"\n"}
                  • Evidence-based recommendations and references
                  {"\n\n"}
                  📚 Full Document Content:
                  {"\n\n"}
                  All sections of the HMCAS Clinical Practice Guidelines v2.4 are accessible through the interactive table of contents. Each section provides comprehensive, evidence-based protocols approved by the HMCAS Medical Director.
                  {"\n\n"}
                  To access specific protocols:
                  1. Return to the table of contents
                  2. Select any section to view detailed content
                  3. Use bookmarks to save frequently accessed sections
                  4. Search across all documents for specific topics
                  {"\n\n"}
                  For emergency flowcharts and decision trees, visit the FLOWCHART section from the main menu.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Alert.alert(
                  'Content Available',
                  'All section content is available within the app. Navigate using the table of contents for detailed information.',
                  [{ text: 'OK' }]
                );
              }}
              testID="viewer-info"
            >
              <FileText size={20} color="#3498DB" />
              <Text style={styles.actionText}>Section Info</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.skillsMatrix}>
            <Text style={styles.matrixTitle}>On-scene Checklist</Text>
            <View style={styles.matrixTable}>
              <View style={styles.matrixRow}>
                <Text style={[styles.matrixCell, styles.matrixHeader]}>Step</Text>
                <Text style={[styles.matrixCell, styles.matrixHeader]}>Action</Text>
              </View>
              <View style={styles.matrixRow}>
                <Text style={styles.matrixCell}>1</Text>
                <Text style={styles.matrixCell}>Assess ABCs, attach monitor, obtain vitals</Text>
              </View>
              <View style={styles.matrixRow}>
                <Text style={styles.matrixCell}>2</Text>
                <Text style={styles.matrixCell}>Follow protocol pathway per CPG</Text>
              </View>
              <View style={styles.matrixRow}>
                <Text style={styles.matrixCell}>3</Text>
                <Text style={styles.matrixCell}>Prepare meds/equipment per section guidance</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#3498DB',
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#F39C12',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  tabTextActive: {
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pageLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  searchButton: {
    padding: 4,
    marginRight: 12,
  },
  versionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  pageInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  documentContent: {
    flex: 1,
    padding: 16,
  },
  documentHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  documentTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  documentSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  versionBadge: {
    backgroundColor: '#3498DB',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  versionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  documentInfo: {
    marginBottom: 20,
  },
  infoItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  topicsCloud: {
    marginBottom: 20,
  },
  topicBubble: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  topicText: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    color: '#3498DB',
  },
  versionControl: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  versionControlTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  versionTable: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  versionRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  versionCell: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    color: '#666',
  },
  patHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  patTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  patSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  ageWeightTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  disclaimer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  sopHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sopTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  sopSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  sopVersion: {
    fontSize: 14,
    color: '#666',
  },
  sopGraphic: {
    height: 150,
    backgroundColor: '#5B9BD5',
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  sopLeaves: {
    height: 60,
    backgroundColor: '#E8F4F8',
  },
  sopContent: {
    padding: 16,
  },
  sopText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cpmHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cpmTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cpmMainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  cpmVersion: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cpmVersionText: {
    fontSize: 16,
    color: '#666',
  },
  cpmVersionNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  cpmDiagram: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cpmCenter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cpmCenterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cpmTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cpmTopic: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  cpmTopicText: {
    fontSize: 11,
    color: '#3498DB',
  },
  cpmInfo: {
    marginBottom: 20,
  },
  cpmInfoTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cpmSkills: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  cpmSkillsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  cpmVersionTable: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cpmVersionRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cpmVersionCell: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    color: '#666',
  },
  headerBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentMainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  importantNotice: {
    flexDirection: 'row',
    backgroundColor: '#FEF5E7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#E74C3C',
    lineHeight: 18,
  },
  tableOfContents: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  tocHeader: {
    marginBottom: 12,
  },
  tocTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tocSubtitle: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    marginBottom: 4,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chevron: {
    marginRight: 8,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 13,
    color: '#666',
  },
  pageNumber: {
    fontSize: 12,
    color: '#999',
  },
  keyHighlights: {
    backgroundColor: '#E8F6F3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  highlightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  highlightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27AE60',
    marginTop: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  sectionContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 12,
  },
  contentBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  clinicalTools: {
    marginBottom: 16,
  },
  toolsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  toolCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  sopSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sopItem: {
    marginBottom: 20,
  },
  sopItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 8,
  },
  sopItemText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  procedureHighlights: {
    marginBottom: 16,
  },
  procedureCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  procedureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  procedureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  procedureDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  procedureLevel: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  skillsMatrix: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  matrixTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  matrixTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  matrixRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  matrixCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: '#333',
  },
  matrixHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  pageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27AE60',
  },
  actionButtonDownloaded: {
    backgroundColor: '#E8F6F3',
  },
  actionTextDownloaded: {
    color: '#27AE60',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionActionButton: {
    padding: 4,
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  quickAccessBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  quickAccessActive: {
    backgroundColor: '#3498DB',
  },
  quickAccessText: {
    fontSize: 12,
    color: '#666',
  },
  quickAccessTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchHeader: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  backText: {
    color: '#3498DB',
    fontSize: 14,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  searchCount: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#ccc',
  },
  searchResultItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  searchResultDoc: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  searchResultPage: {
    fontSize: 12,
    color: '#999',
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  searchResultContext: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  searchResultMatch: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  bookmarksHeader: {
    marginBottom: 20,
  },
  bookmarksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookmarksCount: {
    fontSize: 14,
    color: '#666',
  },
  noBookmarks: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noBookmarksText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  noBookmarksSubtext: {
    fontSize: 14,
    color: '#ccc',
  },
  bookmarkItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookmarkDoc: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#999',
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookmarkPage: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bookmarkNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  recentHeader: {
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recentCount: {
    fontSize: 14,
    color: '#666',
  },
  noRecent: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noRecentText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  noRecentSubtext: {
    fontSize: 14,
    color: '#ccc',
  },
  recentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentDoc: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  recentTime: {
    fontSize: 12,
    color: '#999',
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  authorizationNotice: {
    backgroundColor: '#E8F6F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  authNoticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 8,
  },
  authNoticeText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  lmsIntegrationNotice: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  lmsNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 20,
    fontWeight: '500',
  },
  flowchartSection: {
    backgroundColor: '#E8F6F3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  flowchartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 8,
  },
  flowchartDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 16,
  },
  flowchartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  flowchartButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowchartButtonContent: {
    flex: 1,
  },
  flowchartButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  flowchartButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  attachedDocuments: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attachedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  attachedSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  documentCardSize: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  documentCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  documentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  documentCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  documentCardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },
  documentCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  documentCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  documentCardButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  documentCardButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});