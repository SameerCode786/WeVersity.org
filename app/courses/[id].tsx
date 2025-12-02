import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getCourseById, getCourseContent } from '../../backend/courses';

type Course = any;
type CourseContent = any[];

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [content, setContent] = useState<CourseContent>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        const [courseData, contentData] = await Promise.all([
          getCourseById(id),
          getCourseContent(id),
        ]);
        setCourse(courseData);
        setContent(contentData as any);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.centered}>
        <Text>{error ?? 'Course not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <Text style={styles.teacher}>
        Instructor: {course.teacher?.full_name}
      </Text>
      <View style={styles.section}>
        {content.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>Type: {item.content_type}</Text>
            {item.content_body ? <Text>{item.content_body}</Text> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, gap: 16 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '700' },
  description: { color: '#4b5563' },
  teacher: { marginTop: 16, fontWeight: '600' },
  section: { gap: 12, marginTop: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardMeta: { color: '#6b7280', marginBottom: 8 },
});

