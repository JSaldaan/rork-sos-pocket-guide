import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

type ScoreTab = 'GCS' | 'APGAR' | 'SAT' | 'WESTLEY' | 'PGCS';

export default function ScoresScreen() {
  const [activeTab, setActiveTab] = useState<ScoreTab>('GCS');
  
  // GCS State
  const [gcsEye, setGcsEye] = useState<number | null>(null);
  const [gcsVerbal, setGcsVerbal] = useState<number | null>(null);
  const [gcsMotor, setGcsMotor] = useState<number | null>(null);
  
  // APGAR State
  const [apgarAppearance, setApgarAppearance] = useState<number | null>(null);
  const [apgarPulse, setApgarPulse] = useState<number | null>(null);
  const [apgarGrimace, setApgarGrimace] = useState<number | null>(null);
  const [apgarActivity, setApgarActivity] = useState<number | null>(null);
  const [apgarRespiration, setApgarRespiration] = useState<number | null>(null);
  
  // SAT State
  const [satResponsiveness, setSatResponsiveness] = useState<number | null>(null);
  const [satSpeech, setSatSpeech] = useState<number | null>(null);
  
  // Westley State
  const [westleyStridor, setWestleyStridor] = useState<number | null>(null);
  const [westleyRecession, setWestleyRecession] = useState<number | null>(null);
  const [westleyAirEntry, setWestleyAirEntry] = useState<number | null>(null);
  const [westleyCyanosis, setWestleyCyanosis] = useState<number | null>(null);
  const [westleyLOC, setWestleyLOC] = useState<number | null>(null);
  
  // PGCS State
  const [pgcsEye, setPgcsEye] = useState<number | null>(null);
  const [pgcsVerbal, setPgcsVerbal] = useState<number | null>(null);
  const [pgcsMotor, setPgcsMotor] = useState<number | null>(null);

  const calculateGCS = () => {
    if (gcsEye !== null && gcsVerbal !== null && gcsMotor !== null) {
      return gcsEye + gcsVerbal + gcsMotor;
    }
    return null;
  };

  const calculateAPGAR = () => {
    const scores = [apgarAppearance, apgarPulse, apgarGrimace, apgarActivity, apgarRespiration];
    if (scores.every(s => s !== null)) {
      return scores.reduce((sum, score) => sum! + score!, 0);
    }
    return null;
  };

  const calculateSAT = () => {
    if (satResponsiveness !== null && satSpeech !== null) {
      return satResponsiveness + satSpeech;
    }
    return null;
  };

  const calculateWestley = () => {
    const scores = [westleyStridor, westleyRecession, westleyAirEntry, westleyCyanosis, westleyLOC];
    if (scores.every(s => s !== null)) {
      return scores.reduce((sum, score) => sum! + score!, 0);
    }
    return null;
  };

  const calculatePGCS = () => {
    if (pgcsEye !== null && pgcsVerbal !== null && pgcsMotor !== null) {
      return pgcsEye + pgcsVerbal + pgcsMotor;
    }
    return null;
  };

  const renderGCS = () => (
    <ScrollView style={styles.scoreContent}>
      <Text style={styles.scoreTitle}>Glasgow Coma Scale</Text>
      
      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Eye</Text>
        <TouchableOpacity style={[styles.option, gcsEye === 4 && styles.optionSelected]} onPress={() => setGcsEye(4)}>
          <View style={[styles.radio, gcsEye === 4 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Opens eyes spontaneously</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsEye === 3 && styles.optionSelected]} onPress={() => setGcsEye(3)}>
          <View style={[styles.radio, gcsEye === 3 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Opens eyes in response to voice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsEye === 2 && styles.optionSelected]} onPress={() => setGcsEye(2)}>
          <View style={[styles.radio, gcsEye === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Opens eyes in response to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsEye === 1 && styles.optionSelected]} onPress={() => setGcsEye(1)}>
          <View style={[styles.radio, gcsEye === 1 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Does not open eyes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Verbal</Text>
        <TouchableOpacity style={[styles.option, gcsVerbal === 5 && styles.optionSelected]} onPress={() => setGcsVerbal(5)}>
          <View style={[styles.radio, gcsVerbal === 5 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Oriented, converses normally</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsVerbal === 4 && styles.optionSelected]} onPress={() => setGcsVerbal(4)}>
          <View style={[styles.radio, gcsVerbal === 4 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Confused, disoriented</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsVerbal === 3 && styles.optionSelected]} onPress={() => setGcsVerbal(3)}>
          <View style={[styles.radio, gcsVerbal === 3 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Inappropriate words</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsVerbal === 2 && styles.optionSelected]} onPress={() => setGcsVerbal(2)}>
          <View style={[styles.radio, gcsVerbal === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Incomprehensible speech</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsVerbal === 1 && styles.optionSelected]} onPress={() => setGcsVerbal(1)}>
          <View style={[styles.radio, gcsVerbal === 1 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>No response</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Motor</Text>
        <TouchableOpacity style={[styles.option, gcsMotor === 6 && styles.optionSelected]} onPress={() => setGcsMotor(6)}>
          <View style={[styles.radio, gcsMotor === 6 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Obeys commands for movement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsMotor === 5 && styles.optionSelected]} onPress={() => setGcsMotor(5)}>
          <View style={[styles.radio, gcsMotor === 5 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Localizes to painful stimuli</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsMotor === 4 && styles.optionSelected]} onPress={() => setGcsMotor(4)}>
          <View style={[styles.radio, gcsMotor === 4 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Withdraws in response to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsMotor === 3 && styles.optionSelected]} onPress={() => setGcsMotor(3)}>
          <View style={[styles.radio, gcsMotor === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>Flexion in response to pain</Text>
          <Text style={styles.optionSubtext}>(decorticate response)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsMotor === 2 && styles.optionSelected]} onPress={() => setGcsMotor(2)}>
          <View style={[styles.radio, gcsMotor === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Extension to painful stimuli</Text>
          <Text style={styles.optionSubtext}>(decerebrate response)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, gcsMotor === 1 && styles.optionSelected]} onPress={() => setGcsMotor(1)}>
          <View style={[styles.radio, gcsMotor === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>No response</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>GCS: {calculateGCS() || '--'}</Text>
      </TouchableOpacity>
      
      <View style={styles.scoreIndicator}>
        <View style={[styles.scoreBox, { backgroundColor: '#999' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#3498DB' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#27AE60' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#2C3E50' }]} />
      </View>
    </ScrollView>
  );

  const renderAPGAR = () => (
    <ScrollView style={styles.scoreContent}>
      <Text style={styles.scoreTitle}>APGAR Score</Text>
      
      <View style={styles.scoreSection}>
        <View style={styles.apgarRow}>
          <View style={styles.apgarLabel}>
            <Text style={styles.apgarLabelText}>Appearance</Text>
            <Text style={styles.apgarLabelSubtext}>Skin color</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.option, apgarAppearance === 0 && styles.optionSelected]} onPress={() => setApgarAppearance(0)}>
          <View style={[styles.radio, apgarAppearance === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>Cyanotic or pale all over</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarAppearance === 1 && styles.optionSelected]} onPress={() => setApgarAppearance(1)}>
          <View style={[styles.radio, apgarAppearance === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Peripheral cyanosis only</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarAppearance === 2 && styles.optionSelected]} onPress={() => setApgarAppearance(2)}>
          <View style={[styles.radio, apgarAppearance === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#E91E63' }]}>Pink</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.apgarRow}>
          <View style={styles.apgarLabel}>
            <Text style={styles.apgarLabelText}>Pulse</Text>
            <Text style={styles.apgarLabelSubtext}>Heart rate</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.option, apgarPulse === 0 && styles.optionSelected]} onPress={() => setApgarPulse(0)}>
          <View style={[styles.radio, apgarPulse === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarPulse === 1 && styles.optionSelected]} onPress={() => setApgarPulse(1)}>
          <View style={[styles.radio, apgarPulse === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Less than 100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarPulse === 2 && styles.optionSelected]} onPress={() => setApgarPulse(2)}>
          <View style={[styles.radio, apgarPulse === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#E91E63' }]}>100 - 140</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.apgarRow}>
          <View style={styles.apgarLabel}>
            <Text style={styles.apgarLabelText}>Grimace</Text>
            <Text style={styles.apgarLabelSubtext}>Reflex irritability</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.option, apgarGrimace === 0 && styles.optionSelected]} onPress={() => setApgarGrimace(0)}>
          <View style={[styles.radio, apgarGrimace === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>No response to stimulation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarGrimace === 1 && styles.optionSelected]} onPress={() => setApgarGrimace(1)}>
          <View style={[styles.radio, apgarGrimace === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Grimace (facial movement) or weak cry when stimulated</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarGrimace === 2 && styles.optionSelected]} onPress={() => setApgarGrimace(2)}>
          <View style={[styles.radio, apgarGrimace === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#E91E63' }]}>Cry when stimulated</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.apgarRow}>
          <View style={styles.apgarLabel}>
            <Text style={styles.apgarLabelText}>Activity</Text>
            <Text style={styles.apgarLabelSubtext}>Tone</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.option, apgarActivity === 0 && styles.optionSelected]} onPress={() => setApgarActivity(0)}>
          <View style={[styles.radio, apgarActivity === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>Floppy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarActivity === 1 && styles.optionSelected]} onPress={() => setApgarActivity(1)}>
          <View style={[styles.radio, apgarActivity === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Some flexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarActivity === 2 && styles.optionSelected]} onPress={() => setApgarActivity(2)}>
          <View style={[styles.radio, apgarActivity === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#E91E63' }]}>Well flexed and resisting extension</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.apgarRow}>
          <View style={styles.apgarLabel}>
            <Text style={styles.apgarLabelText}>Respiration</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.option, apgarRespiration === 0 && styles.optionSelected]} onPress={() => setApgarRespiration(0)}>
          <View style={[styles.radio, apgarRespiration === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>Apnoeic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarRespiration === 1 && styles.optionSelected]} onPress={() => setApgarRespiration(1)}>
          <View style={[styles.radio, apgarRespiration === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Slow, irregular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, apgarRespiration === 2 && styles.optionSelected]} onPress={() => setApgarRespiration(2)}>
          <View style={[styles.radio, apgarRespiration === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#E91E63' }]}>Strong cry</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>APGAR: {calculateAPGAR() || '--'}/10</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSAT = () => (
    <ScrollView style={styles.scoreContent}>
      <Text style={styles.scoreTitle}>Sedation Assessment Tool</Text>
      
      <View style={styles.scoreSection}>
        <Text style={[styles.sectionLabel, { color: '#E74C3C' }]}>Responsiveness</Text>
        <TouchableOpacity style={[styles.option, satResponsiveness === -3 && styles.optionSelected]} onPress={() => setSatResponsiveness(-3)}>
          <View style={[styles.radio, satResponsiveness === -3 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Continual loud outbursts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === -2 && styles.optionSelected]} onPress={() => setSatResponsiveness(-2)}>
          <View style={[styles.radio, satResponsiveness === -2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Loud out bursts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === -1 && styles.optionSelected]} onPress={() => setSatResponsiveness(-1)}>
          <View style={[styles.radio, satResponsiveness === -1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Normal/Talkative</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === 0 && styles.optionSelected]} onPress={() => setSatResponsiveness(0)}>
          <View style={[styles.radio, satResponsiveness === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>Speaks normally</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === 1 && styles.optionSelected]} onPress={() => setSatResponsiveness(1)}>
          <View style={[styles.radio, satResponsiveness === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Slurring or prominent slowing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === 2 && styles.optionSelected]} onPress={() => setSatResponsiveness(2)}>
          <View style={[styles.radio, satResponsiveness === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Few recognizable words</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satResponsiveness === 3 && styles.optionSelected]} onPress={() => setSatResponsiveness(3)}>
          <View style={[styles.radio, satResponsiveness === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>Nil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <Text style={[styles.sectionLabel, { color: '#E74C3C' }]}>Speech</Text>
        <TouchableOpacity style={[styles.option, satSpeech === -3 && styles.optionSelected]} onPress={() => setSatSpeech(-3)}>
          <View style={[styles.radio, satSpeech === -3 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Combative, violent, out of control</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === -2 && styles.optionSelected]} onPress={() => setSatSpeech(-2)}>
          <View style={[styles.radio, satSpeech === -2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Very anxious and restless</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === -1 && styles.optionSelected]} onPress={() => setSatSpeech(-1)}>
          <View style={[styles.radio, satSpeech === -1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Anxious and restless</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === 0 && styles.optionSelected]} onPress={() => setSatSpeech(0)}>
          <View style={[styles.radio, satSpeech === 0 && styles.radioSelected]} />
          <Text style={styles.optionText}>Responds easily to name, speaks in normal tone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === 1 && styles.optionSelected]} onPress={() => setSatSpeech(1)}>
          <View style={[styles.radio, satSpeech === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Responds only if name called</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === 2 && styles.optionSelected]} onPress={() => setSatSpeech(2)}>
          <View style={[styles.radio, satSpeech === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Responds only to physical stimulation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, satSpeech === 3 && styles.optionSelected]} onPress={() => setSatSpeech(3)}>
          <View style={[styles.radio, satSpeech === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>No response</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>SAT: {calculateSAT() !== null ? calculateSAT() : '--'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderWestley = () => (
    <ScrollView style={styles.scoreContent}>
      <Text style={styles.scoreTitle}>Westley Score</Text>
      
      <View style={styles.scoreSection}>
        <View style={[styles.westleyLabel, { backgroundColor: '#F4D03F' }]}>
          <Text style={styles.westleyLabelText}>Inspiratory Stridor</Text>
        </View>
        <TouchableOpacity style={[styles.option, westleyStridor === 0 && styles.optionSelected]} onPress={() => setWestleyStridor(0)}>
          <View style={[styles.radio, westleyStridor === 0 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyStridor === 1 && styles.optionSelected]} onPress={() => setWestleyStridor(1)}>
          <View style={[styles.radio, westleyStridor === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>When agitated</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyStridor === 2 && styles.optionSelected]} onPress={() => setWestleyStridor(2)}>
          <View style={[styles.radio, westleyStridor === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>At rest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={[styles.westleyLabel, { backgroundColor: '#F39C12' }]}>
          <Text style={styles.westleyLabelText}>Intercostal Recession</Text>
        </View>
        <TouchableOpacity style={[styles.option, westleyRecession === 0 && styles.optionSelected]} onPress={() => setWestleyRecession(0)}>
          <View style={[styles.radio, westleyRecession === 0 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyRecession === 1 && styles.optionSelected]} onPress={() => setWestleyRecession(1)}>
          <View style={[styles.radio, westleyRecession === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Mild</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyRecession === 2 && styles.optionSelected]} onPress={() => setWestleyRecession(2)}>
          <View style={[styles.radio, westleyRecession === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Moderate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyRecession === 3 && styles.optionSelected]} onPress={() => setWestleyRecession(3)}>
          <View style={[styles.radio, westleyRecession === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>Severe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={[styles.westleyLabel, { backgroundColor: '#E67E22' }]}>
          <Text style={styles.westleyLabelText}>Air Entry</Text>
        </View>
        <TouchableOpacity style={[styles.option, westleyAirEntry === 0 && styles.optionSelected]} onPress={() => setWestleyAirEntry(0)}>
          <View style={[styles.radio, westleyAirEntry === 0 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyAirEntry === 1 && styles.optionSelected]} onPress={() => setWestleyAirEntry(1)}>
          <View style={[styles.radio, westleyAirEntry === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>Mildly decreased</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyAirEntry === 2 && styles.optionSelected]} onPress={() => setWestleyAirEntry(2)}>
          <View style={[styles.radio, westleyAirEntry === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Severely decreased</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={[styles.westleyLabel, { backgroundColor: '#D35400' }]}>
          <Text style={styles.westleyLabelText}>Cyanosis</Text>
        </View>
        <TouchableOpacity style={[styles.option, westleyCyanosis === 0 && styles.optionSelected]} onPress={() => setWestleyCyanosis(0)}>
          <View style={[styles.radio, westleyCyanosis === 0 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyCyanosis === 4 && styles.optionSelected]} onPress={() => setWestleyCyanosis(4)}>
          <View style={[styles.radio, westleyCyanosis === 4 && styles.radioSelected]} />
          <Text style={styles.optionText}>With agitation/activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyCyanosis === 5 && styles.optionSelected]} onPress={() => setWestleyCyanosis(5)}>
          <View style={[styles.radio, westleyCyanosis === 5 && styles.radioSelected]} />
          <Text style={styles.optionText}>At rest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <View style={[styles.westleyLabel, { backgroundColor: '#C0392B' }]}>
          <Text style={styles.westleyLabelText}>LOC</Text>
        </View>
        <TouchableOpacity style={[styles.option, westleyLOC === 0 && styles.optionSelected]} onPress={() => setWestleyLOC(0)}>
          <View style={[styles.radio, westleyLOC === 0 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Awake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, westleyLOC === 5 && styles.optionSelected]} onPress={() => setWestleyLOC(5)}>
          <View style={[styles.radio, westleyLOC === 5 && styles.radioSelected]} />
          <Text style={styles.optionText}>Altered</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>GET SCORE: {calculateWestley() !== null ? calculateWestley() : '--'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPGCS = () => (
    <ScrollView style={styles.scoreContent}>
      <Text style={styles.scoreTitle}>Pediatric Glasgow Coma Scale</Text>
      
      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Eye</Text>
        <TouchableOpacity style={[styles.option, pgcsEye === 4 && styles.optionSelected]} onPress={() => setPgcsEye(4)}>
          <View style={[styles.radio, pgcsEye === 4 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Opens eyes spontaneously</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsEye === 3 && styles.optionSelected]} onPress={() => setPgcsEye(3)}>
          <View style={[styles.radio, pgcsEye === 3 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Opens eyes in response to sound</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsEye === 2 && styles.optionSelected]} onPress={() => setPgcsEye(2)}>
          <View style={[styles.radio, pgcsEye === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Opens eyes in response to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsEye === 1 && styles.optionSelected]} onPress={() => setPgcsEye(1)}>
          <View style={[styles.radio, pgcsEye === 1 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#3498DB' }]}>Does not open eyes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Verbal</Text>
        <TouchableOpacity style={[styles.option, pgcsVerbal === 5 && styles.optionSelected]} onPress={() => setPgcsVerbal(5)}>
          <View style={[styles.radio, pgcsVerbal === 5 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Age-appropriate vocalization, smile, orientation to sound</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsVerbal === 4 && styles.optionSelected]} onPress={() => setPgcsVerbal(4)}>
          <View style={[styles.radio, pgcsVerbal === 4 && styles.radioSelected]} />
          <Text style={styles.optionText}>Cries, irritable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsVerbal === 3 && styles.optionSelected]} onPress={() => setPgcsVerbal(3)}>
          <View style={[styles.radio, pgcsVerbal === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>Cries to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsVerbal === 2 && styles.optionSelected]} onPress={() => setPgcsVerbal(2)}>
          <View style={[styles.radio, pgcsVerbal === 2 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Moans to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsVerbal === 1 && styles.optionSelected]} onPress={() => setPgcsVerbal(1)}>
          <View style={[styles.radio, pgcsVerbal === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>No response</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.sectionLabel}>Motor</Text>
        <TouchableOpacity style={[styles.option, pgcsMotor === 6 && styles.optionSelected]} onPress={() => setPgcsMotor(6)}>
          <View style={[styles.radio, pgcsMotor === 6 && styles.radioSelected]} />
          <Text style={[styles.optionText, { color: '#27AE60' }]}>Spontaneous movements (obeys verbal command)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsMotor === 5 && styles.optionSelected]} onPress={() => setPgcsMotor(5)}>
          <View style={[styles.radio, pgcsMotor === 5 && styles.radioSelected]} />
          <Text style={styles.optionText}>Withdraws to touch (localizes pain)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsMotor === 4 && styles.optionSelected]} onPress={() => setPgcsMotor(4)}>
          <View style={[styles.radio, pgcsMotor === 4 && styles.radioSelected]} />
          <Text style={styles.optionText}>Withdraws to pain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsMotor === 3 && styles.optionSelected]} onPress={() => setPgcsMotor(3)}>
          <View style={[styles.radio, pgcsMotor === 3 && styles.radioSelected]} />
          <Text style={styles.optionText}>Abnormal flexion to pain</Text>
          <Text style={styles.optionSubtext}>(decorticate posture)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsMotor === 2 && styles.optionSelected]} onPress={() => setPgcsMotor(2)}>
          <View style={[styles.radio, pgcsMotor === 2 && styles.radioSelected]} />
          <Text style={styles.optionText}>Abnormal extension to pain</Text>
          <Text style={styles.optionSubtext}>(decerebrate posture)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, pgcsMotor === 1 && styles.optionSelected]} onPress={() => setPgcsMotor(1)}>
          <View style={[styles.radio, pgcsMotor === 1 && styles.radioSelected]} />
          <Text style={styles.optionText}>No response</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>PGCS: {calculatePGCS() || '--'}</Text>
      </TouchableOpacity>
      
      <View style={styles.scoreIndicator}>
        <View style={[styles.scoreBox, { backgroundColor: '#999' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#3498DB' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#27AE60' }]} />
        <View style={[styles.scoreBox, { backgroundColor: '#2C3E50' }]} />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'GCS' && styles.tabActive]} 
            onPress={() => setActiveTab('GCS')}
          >
            <Text style={[styles.tabText, activeTab === 'GCS' && styles.tabTextActive]}>GCS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'APGAR' && styles.tabActive]} 
            onPress={() => setActiveTab('APGAR')}
          >
            <Text style={[styles.tabText, activeTab === 'APGAR' && styles.tabTextActive]}>APGAR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'SAT' && styles.tabActive]} 
            onPress={() => setActiveTab('SAT')}
          >
            <Text style={[styles.tabText, activeTab === 'SAT' && styles.tabTextActive]}>SAT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'WESTLEY' && styles.tabActive]} 
            onPress={() => setActiveTab('WESTLEY')}
          >
            <Text style={[styles.tabText, activeTab === 'WESTLEY' && styles.tabTextActive]}>WESTLEY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'PGCS' && styles.tabActive]} 
            onPress={() => setActiveTab('PGCS')}
          >
            <Text style={[styles.tabText, activeTab === 'PGCS' && styles.tabTextActive]}>PGCS</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {activeTab === 'GCS' && renderGCS()}
      {activeTab === 'APGAR' && renderAPGAR()}
      {activeTab === 'SAT' && renderSAT()}
      {activeTab === 'WESTLEY' && renderWestley()}
      {activeTab === 'PGCS' && renderPGCS()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#F39C12',
  },
  tabBar: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  tabTextActive: {
    color: '#fff',
  },
  scoreContent: {
    flex: 1,
    padding: 16,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderRadius: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    marginTop: 2,
  },
  radioSelected: {
    borderColor: '#27AE60',
    backgroundColor: '#27AE60',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  optionSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  calculateButton: {
    backgroundColor: '#666',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  scoreBox: {
    width: 40,
    height: 8,
    borderRadius: 4,
  },
  apgarRow: {
    marginBottom: 12,
  },
  apgarLabel: {
    backgroundColor: '#E91E63',
    padding: 12,
    borderRadius: 8,
  },
  apgarLabelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  apgarLabelSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  westleyLabel: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  westleyLabelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});