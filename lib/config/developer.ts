export interface DeveloperInfo {
  name: string;
  shortName: string;
  role: string;
  bio: string;
  initials: string;
  accentClass: string; // tailwind gradient classes
  contacts: {
    phone: { label: string; href: string };
    whatsapp: { label: string; href: string };
    email: { label: string; href: string };
    gmail: { label: string; href: string };
    github: { label: string; href: string };
    instagram: { label: string; href: string };
  };
}

export const developer: DeveloperInfo = {
  name: "Yogi Prasetya Sadewa",
  shortName: "Yogi P. Sadewa",
  role: "Full-stack Developer",
  bio: "Sistem informasi akademik untuk akreditasi Prodi Ilmu Komputer, UBBG.",
  initials: "YS",
  accentClass:
    "from-sky-500 via-blue-600 to-indigo-700",
  contacts: {
    phone: {
      label: "+62 812-3456-7890",
      href: "tel:+6281234567890",
    },
    whatsapp: {
      label: "+62 812-3456-7890",
      href: "https://wa.me/6281234567890",
    },
    email: {
      label: "yogi@ubbg.ac.id",
      href: "mailto:yogi@ubbg.ac.id",
    },
    gmail: {
      label: "yogiprasetya@gmail.com",
      href: "mailto:yogiprasetya@gmail.com",
    },
    github: {
      label: "github.com/yogiprasetya",
      href: "https://github.com/yogiprasetya",
    },
    instagram: {
      label: "@yogiprasetya",
      href: "https://instagram.com/yogiprasetya",
    },
  },
};