import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { GitBranch, X, AlertCircle, CheckCircle, Activity } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FlowNode {
  id: string;
  type: 'start' | 'decision' | 'action' | 'end';
  text: string;
  yes?: string;
  no?: string;
  next?: string;
}

interface Flowchart {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
}

export default function FlowchartScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFlowchart, setSelectedFlowchart] = useState<Flowchart | null>(null);

  const flowcharts: Flowchart[] = [
    {
      id: 'primary-survey',
      name: 'Primary Survey & Resuscitation',
      description: 'ABCDE approach for pediatric trauma - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Trauma Patient Arrival', next: '2' },
        { id: '2', type: 'action', text: 'A - Airway with C-spine protection\n• Assess patency\n• Maintain inline stabilization\n• Consider intubation if GCS ≤8', next: '3' },
        { id: '3', type: 'action', text: 'B - Breathing\n• Assess respiratory effort\n• Oxygen 15L/min\n• Treat life-threatening injuries', next: '4' },
        { id: '4', type: 'action', text: 'C - Circulation\n• Control external bleeding\n• Assess perfusion\n• IV/IO access\n• Fluid resuscitation', next: '5' },
        { id: '5', type: 'action', text: 'D - Disability\n• GCS assessment\n• Pupil examination\n• Blood glucose check', next: '6' },
        { id: '6', type: 'action', text: 'E - Exposure\n• Full body examination\n• Prevent hypothermia\n• Log roll with C-spine protection', next: '7' },
        { id: '7', type: 'decision', text: 'Life-threatening injuries identified?', yes: '8', no: '9' },
        { id: '8', type: 'action', text: 'Immediate Intervention\n• Treat identified injuries\n• Activate trauma team\n• Prepare for surgery', next: '10' },
        { id: '9', type: 'action', text: 'Continue Secondary Survey\n• Head-to-toe examination\n• History (AMPLE)\n• Investigations', next: '10' },
        { id: '10', type: 'end', text: 'Definitive Care\n• ICU/Ward admission\n• Surgical intervention\n• Ongoing monitoring' },
      ]
    },
    {
      id: 'head-injury',
      name: 'Pediatric Head Injury Management',
      description: 'Assessment and management of head trauma - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Child with Head Injury', next: '2' },
        { id: '2', type: 'action', text: 'Initial Assessment\n• Mechanism of injury\n• Time of injury\n• Loss of consciousness\n• Vomiting episodes', next: '3' },
        { id: '3', type: 'action', text: 'Primary Survey (ABCDE)\n• Airway with C-spine protection\n• Breathing assessment\n• Circulation status\n• GCS score', next: '4' },
        { id: '4', type: 'decision', text: 'GCS ≤8 or deteriorating?', yes: '5', no: '6' },
        { id: '5', type: 'action', text: 'Severe Head Injury Protocol\n• Intubation (RSI)\n• Maintain SpO2 >95%\n• Avoid hypotension\n• CT brain urgent\n• Neurosurgery consult', next: '15' },
        { id: '6', type: 'decision', text: 'High-risk features present?\n• Skull fracture\n• Focal neurology\n• Seizures\n• >3 vomiting episodes\n• Dangerous mechanism', yes: '7', no: '8' },
        { id: '7', type: 'action', text: 'CT Brain Indicated\n• Arrange urgent CT\n• Neurosurgery standby\n• Admit for observation', next: '9' },
        { id: '8', type: 'action', text: 'Low Risk\n• Observation 4-6 hours\n• Discharge with head injury advice\n• Return if deterioration', next: '14' },
        { id: '9', type: 'decision', text: 'CT shows significant injury?\n• Skull fracture\n• Intracranial bleed\n• Cerebral edema', yes: '10', no: '11' },
        { id: '10', type: 'action', text: 'Neurosurgical Management\n• ICU admission\n• ICP monitoring if indicated\n• Surgical intervention if needed', next: '15' },
        { id: '11', type: 'decision', text: 'GCS 13-14 or symptoms persist?', yes: '12', no: '13' },
        { id: '12', type: 'action', text: 'Ward Admission\n• Neurological observations\n• Repeat CT if deterioration\n• Neurosurgery review', next: '14' },
        { id: '13', type: 'action', text: 'Discharge Planning\n• Head injury advice sheet\n• Return precautions\n• Follow-up arrangement', next: '14' },
        { id: '14', type: 'end', text: 'Discharge or Admit\n• Clear instructions to parents\n• Follow-up as needed' },
        { id: '15', type: 'end', text: 'ICU Management\n• Maintain CPP >40-50mmHg\n• Avoid hypoxia/hypotension\n• Treat raised ICP' },
      ]
    },
    {
      id: 'chest-trauma',
      name: 'Pediatric Chest Trauma',
      description: 'Management of thoracic injuries - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Child with Chest Trauma', next: '2' },
        { id: '2', type: 'action', text: 'Primary Assessment\n• Airway patency\n• Breathing effort\n• Chest wall movement\n• Oxygen saturation', next: '3' },
        { id: '3', type: 'decision', text: 'Life-threatening injury?\n• Tension pneumothorax\n• Massive hemothorax\n• Flail chest\n• Cardiac tamponade', yes: '4', no: '8' },
        { id: '4', type: 'decision', text: 'Tension pneumothorax suspected?\n• Deviated trachea\n• Distended neck veins\n• Absent breath sounds\n• Hypotension', yes: '5', no: '6' },
        { id: '5', type: 'action', text: 'Immediate Needle Decompression\n• 2nd intercostal space\n• Midclavicular line\n• Large bore cannula\n• Follow with chest drain', next: '7' },
        { id: '6', type: 'action', text: 'Other Life-Threatening Injury\n• Chest drain if hemothorax\n• Pericardiocentesis if tamponade\n• Intubation if respiratory failure', next: '7' },
        { id: '7', type: 'action', text: 'Resuscitation\n• High-flow oxygen\n• IV access\n• Fluid resuscitation\n• Blood products if needed', next: '11' },
        { id: '8', type: 'action', text: 'Secondary Assessment\n• Chest X-ray\n• Full examination\n• Monitor vital signs', next: '9' },
        { id: '9', type: 'decision', text: 'Pneumothorax or hemothorax on X-ray?', yes: '10', no: '12' },
        { id: '10', type: 'action', text: 'Chest Drain Insertion\n• 4th/5th intercostal space\n• Mid-axillary line\n• Appropriate size tube\n• Connect to underwater seal', next: '11' },
        { id: '11', type: 'decision', text: 'Ongoing bleeding?\n• >2ml/kg/hr drainage\n• Hemodynamic instability', yes: '13', no: '14' },
        { id: '12', type: 'action', text: 'Pulmonary Contusion Management\n• Oxygen therapy\n• Analgesia\n• Chest physiotherapy\n• Monitor for deterioration', next: '14' },
        { id: '13', type: 'action', text: 'Surgical Intervention\n• Thoracotomy indicated\n• Cardiothoracic surgery\n• Blood transfusion', next: '15' },
        { id: '14', type: 'end', text: 'Ward/ICU Admission\n• Continuous monitoring\n• Repeat imaging\n• Analgesia' },
        { id: '15', type: 'end', text: 'Operating Theatre\n• Emergency thoracotomy\n• Repair injuries\n• ICU post-op' },
      ]
    },
    {
      id: 'abdominal-trauma',
      name: 'Pediatric Abdominal Trauma',
      description: 'Assessment and management of abdominal injuries - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Child with Abdominal Trauma', next: '2' },
        { id: '2', type: 'action', text: 'Initial Assessment\n• Mechanism of injury\n• Abdominal examination\n• Vital signs\n• Signs of peritonism', next: '3' },
        { id: '3', type: 'decision', text: 'Hemodynamically unstable?\n• Tachycardia\n• Hypotension\n• Poor perfusion\n• Altered consciousness', yes: '4', no: '7' },
        { id: '4', type: 'action', text: 'Immediate Resuscitation\n• IV access x2\n• Fluid bolus 20ml/kg\n• Blood products\n• Activate trauma team', next: '5' },
        { id: '5', type: 'decision', text: 'Responds to resuscitation?', yes: '6', no: '11' },
        { id: '6', type: 'action', text: 'FAST/CT Abdomen\n• Identify injury\n• Grade severity\n• Surgical consultation', next: '9' },
        { id: '7', type: 'action', text: 'Stable Patient Assessment\n• Detailed examination\n• Serial abdominal exams\n• Laboratory tests\n• Urinalysis', next: '8' },
        { id: '8', type: 'decision', text: 'Clinical signs of injury?\n• Abdominal tenderness\n• Distension\n• Bruising\n• Seat belt sign', yes: '6', no: '13' },
        { id: '9', type: 'decision', text: 'Solid organ injury identified?\n• Liver laceration\n• Splenic injury\n• Renal trauma', yes: '10', no: '12' },
        { id: '10', type: 'action', text: 'Non-Operative Management\n• ICU/HDU admission\n• Serial Hb monitoring\n• Bed rest\n• Repeat imaging if deterioration', next: '14' },
        { id: '11', type: 'action', text: 'Emergency Laparotomy\n• Ongoing hemorrhage\n• No response to resuscitation\n• Surgical team activated', next: '15' },
        { id: '12', type: 'decision', text: 'Hollow viscus injury?\n• Free air\n• Peritonitis\n• Bowel perforation', yes: '11', no: '10' },
        { id: '13', type: 'action', text: 'Observation Protocol\n• Admit for 24 hours\n• Serial examinations\n• Repeat tests if symptoms', next: '14' },
        { id: '14', type: 'end', text: 'Ward/ICU Care\n• Monitor vital signs\n• Serial Hb\n• Gradual mobilization\n• Discharge when stable' },
        { id: '15', type: 'end', text: 'Surgical Management\n• Repair injuries\n• Control bleeding\n• Post-op ICU care' },
      ]
    },
    {
      id: 'burns',
      name: 'Pediatric Burns Management',
      description: 'Initial management of burn injuries - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Child with Burns', next: '2' },
        { id: '2', type: 'action', text: 'Stop Burning Process\n• Remove from source\n• Remove clothing (not adherent)\n• Cool burn with water 20 min\n• Cover with cling film', next: '3' },
        { id: '3', type: 'action', text: 'Primary Survey (ABCDE)\n• Airway - signs of inhalation\n• Breathing - oxygen\n• Circulation - IV access\n• Disability - GCS\n• Exposure - assess burn', next: '4' },
        { id: '4', type: 'decision', text: 'Inhalation injury suspected?\n• Facial burns\n• Singed nasal hairs\n• Soot in mouth\n• Hoarse voice\n• Stridor', yes: '5', no: '6' },
        { id: '5', type: 'action', text: 'Airway Management\n• High-flow oxygen\n• Early intubation\n• ICU admission\n• Bronchoscopy', next: '7' },
        { id: '6', type: 'action', text: 'Calculate Burn Size\n• Use Lund-Browder chart\n• Exclude erythema\n• Document depth\n• Photograph burns', next: '7' },
        { id: '7', type: 'decision', text: 'Major burn criteria?\n• >10% TBSA\n• Full thickness >5%\n• Face/hands/feet/genitalia\n• Circumferential\n• Electrical/chemical', yes: '8', no: '12' },
        { id: '8', type: 'action', text: 'Fluid Resuscitation\n• Parkland formula:\n  4ml x weight(kg) x %TBSA\n• Give half in first 8 hours\n• Ringer lactate/Hartmann\n• Urinary catheter', next: '9' },
        { id: '9', type: 'action', text: 'Analgesia\n• IV morphine titrated\n• Regular paracetamol\n• Avoid IM injections', next: '10' },
        { id: '10', type: 'decision', text: 'Circumferential burns?\n• Chest - respiratory compromise\n• Limbs - neurovascular compromise', yes: '11', no: '13' },
        { id: '11', type: 'action', text: 'Escharotomy\n• Emergency procedure\n• Relieve compartment syndrome\n• Improve ventilation\n• Surgical team', next: '13' },
        { id: '12', type: 'action', text: 'Minor Burn Management\n• Clean wound\n• Apply dressing\n• Tetanus prophylaxis\n• Analgesia\n• Outpatient follow-up', next: '15' },
        { id: '13', type: 'action', text: 'Transfer to Burns Unit\n• Specialized care\n• Early excision and grafting\n• Multidisciplinary team', next: '14' },
        { id: '14', type: 'end', text: 'Burns Unit Care\n• Wound management\n• Nutrition support\n• Rehabilitation\n• Psychological support' },
        { id: '15', type: 'end', text: 'Discharge Home\n• Dressing instructions\n• Follow-up appointment\n• Return precautions' },
      ]
    },
    {
      id: 'shock',
      name: 'Pediatric Shock Management',
      description: 'Recognition and treatment of shock - CPG 2.4',
      nodes: [
        { id: '1', type: 'start', text: 'Child with Signs of Shock', next: '2' },
        { id: '2', type: 'action', text: 'Recognize Shock\n• Tachycardia\n• Prolonged CRT >2 sec\n• Weak pulses\n• Altered consciousness\n• Hypotension (late sign)', next: '3' },
        { id: '3', type: 'action', text: 'Initial Management\n• High-flow oxygen\n• IV/IO access\n• Monitor vital signs\n• Blood tests (FBC, U/E, glucose)', next: '4' },
        { id: '4', type: 'decision', text: 'Type of shock?\n• Hypovolemic (bleeding/dehydration)\n• Distributive (septic/anaphylactic)\n• Cardiogenic\n• Obstructive', yes: '5', no: '5' },
        { id: '5', type: 'action', text: 'Fluid Resuscitation\n• 20ml/kg bolus crystalloid\n• Reassess after each bolus\n• Maximum 60ml/kg in first hour', next: '6' },
        { id: '6', type: 'decision', text: 'Response to fluids?', yes: '7', no: '8' },
        { id: '7', type: 'action', text: 'Improving Perfusion\n• Continue monitoring\n• Identify and treat cause\n• Maintain fluid balance', next: '13' },
        { id: '8', type: 'decision', text: 'Hemorrhagic shock?\n• Trauma\n• GI bleeding\n• Surgical cause', yes: '9', no: '10' },
        { id: '9', type: 'action', text: 'Hemorrhage Control\n• Activate massive transfusion\n• Blood products 1:1:1 ratio\n• Surgical intervention\n• Tranexamic acid', next: '11' },
        { id: '10', type: 'decision', text: 'Septic shock?\n• Fever/hypothermia\n• Infection source\n• Warm peripheries initially', yes: '12', no: '11' },
        { id: '11', type: 'action', text: 'Inotropic Support\n• Adrenaline infusion\n• Central venous access\n• ICU admission\n• Invasive monitoring', next: '13' },
        { id: '12', type: 'action', text: 'Septic Shock Protocol\n• Broad-spectrum antibiotics\n• Fluid resuscitation\n• Inotropes if fluid refractory\n• Source control', next: '11' },
        { id: '13', type: 'decision', text: 'Shock resolved?\n• Normal HR for age\n• CRT <2 sec\n• Good urine output\n• Alert', yes: '14', no: '15' },
        { id: '14', type: 'end', text: 'Ward Admission\n• Continue monitoring\n• Treat underlying cause\n• Wean support gradually' },
        { id: '15', type: 'end', text: 'ICU Management\n• Invasive monitoring\n• Organ support\n• Treat complications' },
      ]
    },
  ];

  const renderFlowchart = (nodes: FlowNode[]) => {
    const nodeMap = new Map<string, FlowNode>();
    nodes.forEach(node => nodeMap.set(node.id, node));

    const renderNode = (nodeId: string, visited: Set<string> = new Set(), depth: number = 0): React.ReactElement | null => {
      if (depth > 30) {
        return null;
      }

      const node = nodeMap.get(nodeId);
      if (!node) return null;

      const visitKey = `${nodeId}`;
      if (visited.has(visitKey)) {
        return (
          <View key={`loop-${nodeId}-${depth}`} style={styles.loopIndicator}>
            <Text style={styles.loopText}>↻ Return to: {node.text.split('\n')[0]}</Text>
          </View>
        );
      }

      const newVisited = new Set(visited);
      newVisited.add(visitKey);

      const nodeStyle = [
        styles.node,
        node.type === 'start' && styles.startNode,
        node.type === 'decision' && styles.decisionNode,
        node.type === 'action' && styles.actionNode,
        node.type === 'end' && styles.endNode,
      ];

      return (
        <View key={`${nodeId}-${depth}`} style={styles.nodeContainer}>
          <View style={nodeStyle}>
            <Text style={[
              styles.nodeText,
              node.type === 'decision' && styles.decisionText
            ]}>{node.text}</Text>
          </View>

          {node.type === 'decision' && node.yes && node.no && (
            <View style={styles.decisionBranchContainer}>
              <View style={styles.decisionBranch}>
                <View style={styles.branchIndicator}>
                  <View style={styles.branchLine} />
                  <Text style={styles.branchLabel}>YES</Text>
                  <View style={styles.branchArrow} />
                </View>
                <View style={styles.branchContent}>
                  {renderNode(node.yes, newVisited, depth + 1)}
                </View>
              </View>

              <View style={styles.decisionBranch}>
                <View style={styles.branchIndicator}>
                  <View style={styles.branchLine} />
                  <Text style={[styles.branchLabel, styles.noBranchLabel]}>NO</Text>
                  <View style={styles.branchArrow} />
                </View>
                <View style={styles.branchContent}>
                  {renderNode(node.no, newVisited, depth + 1)}
                </View>
              </View>
            </View>
          )}

          {node.next && !node.yes && (
            <>
              <View style={styles.connector} />
              {renderNode(node.next, newVisited, depth + 1)}
            </>
          )}
        </View>
      );
    };

    return renderNode('1');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Activity size={20} color="#2C5F8D" />
          <Text style={styles.infoText}>
            Evidence-based clinical decision trees from CPG 2.4
          </Text>
        </View>

        <View style={styles.flowchartsGrid}>
          {flowcharts.map((flowchart) => (
            <TouchableOpacity
              key={flowchart.id}
              style={styles.flowchartCard}
              onPress={() => setSelectedFlowchart(flowchart)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <GitBranch size={24} color="#3498DB" />
                <Text style={styles.cardTitle}>{flowchart.name}</Text>
              </View>
              <Text style={styles.cardDescription}>{flowchart.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.nodeCount}>{flowchart.nodes.length} steps</Text>
                <Text style={styles.viewText}>View Flowchart →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Flowchart Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.startNode]} />
              <Text style={styles.legendText}>Start/End Point</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.decisionNode]} />
              <Text style={styles.legendText}>Decision Point</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.actionNode]} />
              <Text style={styles.legendText}>Action/Intervention</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedFlowchart !== null}
        animationType="slide"
        onRequestClose={() => setSelectedFlowchart(null)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <GitBranch size={24} color="#3498DB" />
              <Text style={styles.modalTitle}>{selectedFlowchart?.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedFlowchart(null)}
              style={styles.closeButton}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.flowchartDescription}>
              <AlertCircle size={18} color="#3498DB" />
              <Text style={styles.descriptionText}>{selectedFlowchart?.description}</Text>
            </View>

            <View style={styles.flowchartContainer}>
              {selectedFlowchart && (
                <View style={styles.flowchartInner}>
                  {renderFlowchart(selectedFlowchart.nodes)}
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <CheckCircle size={18} color="#27AE60" />
              <Text style={styles.footerText}>
                Follow each step systematically. Reassess frequently.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2C5F8D',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2C5F8D',
    marginLeft: 12,
    fontWeight: '600',
  },
  flowchartsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  flowchartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nodeCount: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  viewText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  legendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  legendItems: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendBox: {
    width: 40,
    height: 30,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  flowchartDescription: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
  },
  flowchartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
  },
  flowchartInner: {
    width: '100%',
    paddingVertical: 4,
  },
  nodeContainer: {
    marginBottom: 4,
    width: '100%',
  },
  node: {
    padding: 8,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 40,
  },
  startNode: {
    backgroundColor: '#E8F5E9',
    borderColor: '#27AE60',
    borderRadius: 24,
  },
  decisionNode: {
    backgroundColor: '#FFF3E0',
    borderColor: '#F39C12',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  actionNode: {
    backgroundColor: '#E3F2FD',
    borderColor: '#3498DB',
  },
  endNode: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E74C3C',
    borderRadius: 24,
  },
  nodeText: {
    fontSize: 10,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 13,
    flexShrink: 1,
  },
  decisionText: {
    fontSize: 10,
    fontWeight: '700',
  },
  connector: {
    width: 2,
    height: 10,
    backgroundColor: '#3498DB',
    marginVertical: 4,
    alignSelf: 'center',
  },
  decisionBranchContainer: {
    width: '100%',
    marginTop: 8,
    gap: 10,
  },
  decisionBranch: {
    width: '100%',
    borderLeftWidth: 2,
    borderLeftColor: '#3498DB',
    paddingLeft: 8,
  },
  branchIndicator: {
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  branchLine: {
    width: 20,
    height: 2,
    backgroundColor: '#3498DB',
    marginBottom: 3,
  },
  branchLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27AE60',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#27AE60',
    marginBottom: 3,
  },
  noBranchLabel: {
    color: '#E74C3C',
    backgroundColor: '#FFEBEE',
    borderColor: '#E74C3C',
  },
  branchArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#3498DB',
  },
  branchContent: {
    width: '100%',
  },
  modalFooter: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  loopIndicator: {
    backgroundColor: '#F3E5F5',
    borderRadius: 6,
    padding: 6,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  loopText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#7B1FA2',
    textAlign: 'center',
  },
});
