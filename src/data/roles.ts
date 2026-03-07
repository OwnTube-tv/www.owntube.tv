export interface Role {
  title: string;
  description: string;
}

export const roles: Role[] = [
  {
    title: "Lead Developer",
    description:
      "Technical leadership and hands-on development for video streaming applications and backend infrastructure.",
  },
  {
    title: "Tech Lead & Architect",
    description: "Strategic technical direction, solution design, and team leadership for video streaming projects.",
  },
  {
    title: "Frontend Development",
    description: "Expert React frontend development for video applications on web, mobile and TV.",
  },
  {
    title: "Infrastructure Architect",
    description:
      "Design and implementation of scalable infrastructure for video delivery and containerized workloads.",
  },
  {
    title: "DevSecOps",
    description:
      "Secure and efficient CI/CD pipelines for a multitude of use cases, from mobile apps to infrastructure deployments.",
  },
  {
    title: "Backend Development",
    description:
      "Robust backend systems for edge deployments, strong authentication, data persistence, and content management.",
  },
];
