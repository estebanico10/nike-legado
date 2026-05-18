import { createContext, useContext, useState, useEffect } from "react";

const SITE_VERSION = "v4"; // bump this when initialHomeSections or initialTeam changes

const SiteContext = createContext();

const initialTeam = {
  groupPhoto: "./assets/team/group.webp",
  groupPhotoPosition: "center 18%",
  members: [
    { id: "1", name: "Esteban David Nicola Miranda", email: "enicolam@unemi.edu.ec", initials: "EN", photo: "./assets/team/esteban.webp", objectPosition: "center 10%" },
    { id: "2", name: "Jostin Enrique Ríos Contreras", email: "jostinrios2007@gmail.com", initials: "JR", photo: "./assets/team/jostin.webp", objectPosition: "center center" },
    { id: "3", name: "Felix Andrés Espinoza Nieves", email: "fespinozan2@unemi.edu.ec", initials: "FE", photo: "./assets/team/felix.webp", objectPosition: "center 8%" },
    { id: "4", name: "Mayerli Scarleth Mora Miranda", email: "Mmoram35@unemi.edu.ec", initials: "MM", photo: "./assets/team/mayerli.webp", objectPosition: "center 15%" },
    { id: "5", name: "Jacob Steven Franco Murillo", email: "jfrancom9@unemi.edu.ec", initials: "JF", photo: "./assets/team/jacob.webp", objectPosition: "center 5%" },
  ]
};

const initialHomeSections = [
  { id: "hero", type: "hero", title: "Portada Nike Legado", visible: true, order: 1 },
  { id: "destacados", type: "destacados", title: "Destacados", visible: true, order: 2 },
  { id: "lookbook", type: "lookbook", title: "LOOKBOOK — VOL. 1", description: "Explora la intersección entre el minimalismo radical y la herencia ecuatoriana a través de nuestra última editorial visual.", visible: true, order: 3, 
    images: [
      { id: "img1", src: "./assets/home/lookbook-1.png", title: "URBAN ANDINO", subtitle: "Colección Cero" },
      { id: "img2", src: "./assets/home/lookbook-2.png", title: "HERENCIA", subtitle: "Archivo 01" },
      { id: "img3", src: "./assets/home/lookbook-3.png", title: "FUTURO", subtitle: "Concepto Experimental" }
    ]
  }
];

export function SiteProvider({ children }) {
  const [team, setTeam] = useState(() => {
    const savedVersion = localStorage.getItem("site_version");
    if (savedVersion !== SITE_VERSION) {
      localStorage.removeItem("site_team");
      localStorage.removeItem("site_homeSections");
    }
    const saved = localStorage.getItem("site_team");
    return saved ? JSON.parse(saved) : initialTeam;
  });

  const [homeSections, setHomeSections] = useState(() => {
    const saved = localStorage.getItem("site_homeSections");
    return saved ? JSON.parse(saved) : initialHomeSections;
  });

  // Persist site version
  useEffect(() => {
    localStorage.setItem("site_version", SITE_VERSION);
  }, []);

  useEffect(() => {
    localStorage.setItem("site_team", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem("site_homeSections", JSON.stringify(homeSections));
  }, [homeSections]);

  const updateTeamMember = (id, updatedData) => {
    setTeam(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, ...updatedData } : m)
    }));
  };

  const addTeamMember = (newMember) => {
    setTeam(prev => ({
      ...prev,
      members: [...prev.members, { id: Date.now().toString(), ...newMember }]
    }));
  };

  const removeTeamMember = (id) => {
    setTeam(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  };

  const updateGroupPhoto = (url) => {
    setTeam(prev => ({ ...prev, groupPhoto: url }));
  };

  const updateHomeSection = (id, updatedData) => {
    setHomeSections(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const addHomeSection = (newSection) => {
    setHomeSections(prev => [...prev, { ...newSection, id: Date.now().toString(), order: prev.length + 1 }]);
  };

  const removeHomeSection = (id) => {
    setHomeSections(prev => prev.filter(s => s.id !== id));
  };

  const reorderHomeSections = (newOrderArray) => {
    setHomeSections(newOrderArray);
  };

  return (
    <SiteContext.Provider value={{
      team, updateTeamMember, addTeamMember, removeTeamMember, updateGroupPhoto,
      homeSections, updateHomeSection, addHomeSection, removeHomeSection, reorderHomeSections
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
