import React, { createContext, ReactNode, useContext, useState } from "react";
import { Course } from "../data/courses";

type BookmarkContextType = {
  bookmarkedCourses: number[];
  toggleBookmark: (courseId: number) => void;
  isBookmarked: (courseId: number) => boolean;
  getBookmarkedCourses: (allCourses: Course[]) => Course[];
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);

  const toggleBookmark = (courseId: number) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const isBookmarked = (courseId: number) => {
    return bookmarkedCourses.includes(courseId);
  };

  const getBookmarkedCourses = (allCourses: Course[]) => {
    return allCourses.filter((course) => bookmarkedCourses.includes(course.id));
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedCourses,
        toggleBookmark,
        isBookmarked,
        getBookmarkedCourses,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
}

