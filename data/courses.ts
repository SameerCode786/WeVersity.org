export type Course = {
  id: number;
  title: string;
  category: string;
  image: any;
  price: string;
  rating?: number;
};

export const allCoursesSeed: Course[] = [
  { id: 1, title: "3D Design Illustration", category: "3D Design", image: require("../assets/images/3da.png"), price: "Free", rating: 4.50 },
  { id: 2, title: "Digital Entrepreneurship", category: "Entrepreneurship", image: require("../assets/images/digitalEnterpreture.png"), price: "Free", rating: 4.50 },
  { id: 3, title: "Learn UX User Persona", category: "UI/UX Design", image: require("../assets/images/learnUx.png"), price: "Free", rating: 4.50 },
  { id: 4, title: "Flutter Mobile Apps", category: "Programming", image: require("../assets/images/python.jpeg"), price: "Free", rating: 4.50 },
  { id: 5, title: "Web Development Basics", category: "Programming", image: require("../assets/images/webdevelopment.jpeg"), price: "$45", rating: 4.50 },
  { id: 6, title: "Data Science with R", category: "Data Science", image: require("../assets/images/Data Science.jpeg"), price: "$60", rating: 4.50 },
  { id: 7, title: "Intro to Python", category: "Programming", image: require("../assets/images/python.jpeg"), price: "$50", rating: 4.50 },
  { id: 8, title: "Chocolate Making at Home", category: "Food Business", image: require("../assets/images/3da.png"), price: "Free", rating: 4.50 },
];

