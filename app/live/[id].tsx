import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getLiveById, swipeNextLive } from '../../backend/live';
import { subscribeToLiveComments } from '../../backend/supabase/supabaseHelpers';

type LiveSession = Awaited<ReturnType<typeof getLiveById>>;

export default function LivePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const liveSession = await getLiveById(id);
        setSession(liveSession);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!session) return;
    const channel = subscribeToLiveComments(session.id, (comment) => {
      setComments((prev) => [comment, ...prev]);
    });
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session]);

  const handleSwipe = async (direction: 'next' | 'prev') => {
    if (!session) return;
    // backend.swipeNextLive currently only requires the current live id
    const nextSession = await swipeNextLive(session.id);
    if (nextSession) {
      router.replace(`/live/${nextSession.id}`);
    }
  };

  const header = useMemo(() => {
    if (!session) return null;
    return (
      <View style={styles.liveHeader}>
        <Text style={styles.liveHeaderTitle}>{session.title}</Text>
        <Text style={styles.liveHeaderSubtitle}>
          {session.teacher?.full_name ?? 'Teacher'}
        </Text>
        <Text style={styles.liveHeaderHint}>Swipe up/down for next live</Text>
      </View>
    );
  }, [session]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorState}>
        <Text>No live session found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.streamContainer}>
        <View style={styles.streamPlaceholder}>
          <Text style={styles.streamTitle}>Live Stream</Text>
          <Text style={styles.streamMeta}>URL: {session.stream_url}</Text>
        </View>
        <View style={styles.swipeControls}>
          <TouchableOpacity onPress={() => handleSwipe('prev')}>
            <Text style={styles.controlText}>↑ Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSwipe('next')}>
            <Text style={styles.controlText}>↓ Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.commentsPanel}>
        {header}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <Text style={styles.commentAuthor}>{item.author_id}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 48 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  loading: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  streamContainer: { flex: 1 },
  streamPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  streamMeta: { color: '#d1d5db', marginTop: 12 },
  swipeControls: {
    position: 'absolute',
    left: 24,
    top: 64,
    bottom: 64,
    justifyContent: 'space-between',
  },
  controlText: { color: '#fff', fontSize: 18 },
  commentsPanel: {
    height: 280,
    backgroundColor: '#ffffffee',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 16,
  },
  liveHeader: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#111827',
    padding: 16,
  },
  liveHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  liveHeaderSubtitle: { color: '#e5e7eb', marginTop: 4 },
  liveHeaderHint: { color: '#9ca3af', marginTop: 8 },
  commentRow: { marginBottom: 12 },
  commentAuthor: { fontWeight: '600' },
});

