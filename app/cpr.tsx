import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Activity, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react-native';

export default function CPRScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [compressions, setCompressions] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bpm, setBpm] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setCompressions(prev => {
          const newCount = prev + 1;
          if (newCount >= 30) {
            setCycles(c => c + 1);
            return 0;
          }
          return newCount;
        });
      }, 600); // 100 BPM = 600ms per compression
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (elapsedTime > 0) {
      const currentBpm = Math.round((compressions + cycles * 30) / (elapsedTime / 60));
      setBpm(currentBpm);
    }
  }, [compressions, cycles, elapsedTime]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompressions(0);
    setCycles(0);
    setElapsedTime(0);
    setBpm(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Activity size={32} color="#E74C3C" />
          <Text style={styles.headerTitle}>CPR Timer</Text>
        </View>

        <View style={styles.timerCard}>
          <View style={styles.compressionDisplay}>
            <Text style={styles.compressionCount}>{compressions}</Text>
            <Text style={styles.compressionLabel}>Compressions</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cycles}</Text>
              <Text style={styles.statLabel}>Cycles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, bpm < 100 || bpm > 120 ? styles.warningText : styles.goodText]}>
                {bpm}
              </Text>
              <Text style={styles.statLabel}>BPM</Text>
            </View>
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, isRunning ? styles.pauseButton : styles.startButton]}
              onPress={handleStartStop}
            >
              {isRunning ? (
                <>
                  <Pause size={24} color="#fff" />
                  <Text style={styles.controlButtonText}>Pause</Text>
                </>
              ) : (
                <>
                  <Play size={24} color="#fff" />
                  <Text style={styles.controlButtonText}>Start</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <RotateCcw size={24} color="#fff" />
              <Text style={styles.controlButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>CPR Guidelines</Text>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineLabel}>Compression Rate</Text>
            <Text style={styles.guidelineValue}>100-120 per minute</Text>
          </View>

          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineLabel}>Compression Depth</Text>
            <Text style={styles.guidelineValue}>Adult: 2-2.4 inches</Text>
          </View>

          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineLabel}>Compression:Ventilation</Text>
            <Text style={styles.guidelineValue}>30:2</Text>
          </View>

          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineLabel}>Switch Compressor</Text>
            <Text style={styles.guidelineValue}>Every 2 minutes</Text>
          </View>
        </View>

        <View style={styles.alertCard}>
          <AlertCircle size={20} color="#E67E22" />
          <Text style={styles.alertText}>
            High-quality CPR: Push hard, push fast, allow complete recoil, minimize interruptions
          </Text>
        </View>

        <View style={styles.sequenceCard}>
          <Text style={styles.sequenceTitle}>Adult CPR Sequence</Text>
          <View style={styles.sequenceSteps}>
            <Text style={styles.sequenceStep}>1. Check responsiveness</Text>
            <Text style={styles.sequenceStep}>2. Call for help / AED</Text>
            <Text style={styles.sequenceStep}>3. Check pulse (≤10 sec)</Text>
            <Text style={styles.sequenceStep}>4. Begin compressions</Text>
            <Text style={styles.sequenceStep}>5. Open airway</Text>
            <Text style={styles.sequenceStep}>6. Give 2 breaths</Text>
            <Text style={styles.sequenceStep}>7. Continue 30:2</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compressionDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  compressionCount: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  compressionLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  warningText: {
    color: '#E67E22',
  },
  goodText: {
    color: '#27AE60',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#27AE60',
  },
  pauseButton: {
    backgroundColor: '#E67E22',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#95A5A6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guidelinesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  guidelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  guidelineLabel: {
    fontSize: 14,
    color: '#666',
  },
  guidelineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    lineHeight: 18,
  },
  sequenceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sequenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sequenceSteps: {
    gap: 8,
  },
  sequenceStep: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 8,
  },
});