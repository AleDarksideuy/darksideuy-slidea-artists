export interface Project {
  name: string;

  image?: string;

  description?: string;

  genre?: string;

  country?: string;

  city?: string;

  year?: string;

  instagram?: string;

  facebook?: string;

  youtube?: string;

  spotify?: string;
}

export interface Release {
  title: string;

  type: "Single" | "EP" | "Album" | "Live Session" | "Live Show";

  status:
    | "Lanzado"
    | "Próximamente"
    | "Grabación"
    | "Mezcla"
    | "Masterización";

  cover?: string;

  description?: string;

  releaseDate?: string;

  spotify?: string;

  youtube?: string;

  appleMusic?: string;

  soundcloud?: string;

  presave?: string;

  tracks?: string[];
}

export interface Artist {
  
  slug: string;
  name: string;
  legalName: string;
  country: string;
  countryCode: string;
  city: string;
  category: string;
  description: string;
  image: string;
  avatar: string;

    heroVideo?: string;

  instagram?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;

    youtubePlaylist?: string;

    latestDates?: {
  title: string;
  date: string;
  location: string;
  description: string;
}[];

  projects?: Project[];
  
  releases?: Release[];
}



export const artists: Artist[] = [

     {
  slug: "martin-arbelo",
      
  name: "MARTIN ARBELO",
  legalName: "Martin Arbelo",
  country: "Uruguay",
  countryCode: "uy",
  city: "Paysandú",
  category: "Rock pop",
  description: "",
  image: "/artists/martinarbelo.jpeg",
  avatar: "/artists/martinavatar.jpg",
  heroVideo: "/artists/martin arbelo/martinarbeloclip.mp4",
 projects: [
  {
    name: "ANTAGÓNICA",
    instagram: "https://www.instagram.com/antagonica.oficial/",
    youtube: "https://www.youtube.com/@antagonica.oficial",
    spotify: "https://open.spotify.com/artist/6YOfMfQCuI65SY2aM8YN6b?si=T7a-LPeHTHGOu3WVxZQvpw",
    facebook: "https://www.facebook.com/profile.php?id=100047391682890",
  },
  {
    name: "LA CRISIS URUGUAYA",
    instagram: "https://www.instagram.com/la_crisis_uruguaya/",
    youtube: "https://www.youtube.com/@LaCrisisUruguaya",
    spotify: "https://open.spotify.com/artist/03iaw5bKJhdF0xNPSX7dt0?si=vaeiykZgSEW6gzVjn9dwhQ",
    facebook: "https://www.facebook.com/profile.php?id=61559026508674",
  },
  {
    name: "LA CASA DEL DINOSAURIO",
    instagram: "https://www.instagram.com/lacasadeldinosaurio/",
    youtube: "https://www.youtube.com/@lacasadeldinosaurio8375/videos",
    spotify: "https://open.spotify.com/artist/1HaOLPqqdeaBqSc97k3WhF?si=Os8EjOdnQzy1d-YMKU-PGg",
    facebook: "https://www.facebook.com/profile.php?id=100063124245171",
  },
],
},
   {
    slug: "el-asturiano",
    name: "EL ASTURIANO",
    legalName: "Manuel Alvarez",
    country: "Uruguay",
    countryCode: "uy",
    city: "Florida",
    category: "Folklore / Rock / Murga",
    description: "",
    image: "/artists/elasturiano.jpeg",
    avatar: "/artists/elasturianoavatar.jpg",
    heroVideo: "/artists/elasturiano/elasturianoclip.mp4",
    instagram: "https://www.instagram.com/manuel_el_asturiano/",
    youtube: "https://www.youtube.com/@Elasturiano-i2w",
    spotify: "",
    facebook: "",
  },
 

  {
    slug: "zonno",
    name: "ZONNO",
    legalName: " Zonno",
    country: "Uruguay",
    countryCode: "uy",
    city: "Tacuarembó",
    category: "Soul / Musica Disco / Funk",
    description: "",
    image: "/artists/zonno.jpeg",
    avatar: "/artists/zonnoavatar.jpg",
    heroVideo: "/artists/zonno/zonnoclip.mp4",
    instagram: "https://www.instagram.com/zonnobanda/",
    youtube: "https://www.youtube.com/@zonnobanda",
    spotify: "https://open.spotify.com/intl-es/track/1AKc89yAyiN4prGhTUMvQv?nd=1&dlsi=3a65f028d2714121&autoplay_ok=1",
    facebook: "",
      releases: [
  {
    title: "Otra Vez En La Luna",

    type: "Album",

    cover: "/releases/otra vez en la luna.jpg",

    description:
      "No te pierdas el nuevo álbum de Zonno.",

    status: "Lanzado",

    releaseDate: "Octubre 2026",

    spotify: "https://open.spotify.com/intl-es/album/4h0wRnIF4f49OemwwCOgnD",

    tracks: [
      "Si Para Buscarte",
      "Te Espero",
      "Otra Vez En La Luna",
      "No Verbal",
      "Dame Una Moneda",
      "No Hay Problemas",
      "No Hay Mas Venenos",
      "Quiero Ver",
      "Solo Sentir",
    ],
  },
  
],

    
  },

  {
    slug: "lupretinia",
    name: "LUPRETINIA",
    legalName: "Agustina Scelzi",
    country: "Argentina",
    countryCode: "ar",
    city: "Entre Ríos",
    category: "Indie / Dreampop",
    description:
      "",
    image: "/artists/lupretinia.jpeg",
    avatar: "/artists/lupretiniaavatar.jpg",
    heroVideo: "/artists/lupretinia/intro.mp4",
    instagram: "https://www.instagram.com/lupretinia/ ",
    youtube: "https://www.youtube.com/@lupretinia ",
    spotify: "https://open.spotify.com/intl-es/artist/6960ZeP0HXwRLo81fBpAlW?si=jy_tH49xQyKtc5ACjbgATg",
        releases: [
  {
    title: "202X",

    type: "Album",

    cover: "/artists/releases/202X_Cover.jpg",

    description:
      "Próximo sencillo que marcará el inicio de una nueva etapa artística.",

    status: "Lanzado",

    releaseDate: "Junio 2026",

    
  },
  
],
    
  },

   {
    slug: "los-espejos",
    name: "LOS ESPEJOS",
    legalName: "Los Espejos",
    country: "Uruguay",
    countryCode: "uy",
    city: "Montevideo",
    category: "Rock",
    description: "",
    image: "/artists/losespejos.jpeg",
    avatar: "/artists/losespejosavatar.jpg",
    heroVideo: "/artists/los espejos/losespejosclip.mp4",
    instagram: "https://www.instagram.com/losespejosuy/",
    youtube: "https://www.youtube.com/@losespejosuy",
    spotify: "https://open.spotify.com/intl-es/artist/5P08EnfFwAuPjUGX6ZMR2w?si=1jPw7mTGRWOHjVA2sKp97g",
    facebook: "",
           releases: [
  {
    title: "No La Mires Más",

    type: "Album",

    cover: "/artists/releases/No_La_Mires_Mas_Cover.jpg",

    description:
      "Próximo sencillo que marcará el inicio de una nueva etapa artística.",

    status: "Lanzado",

    releaseDate: "Julio 2025",

    
  },
  
],
  },

 



  

  {
    slug: "carlin-levratto",
    name: "CARLÍN LEVRATTO",
    legalName: "Carlín Levratto",
    country: "Uruguay",
    countryCode: "uy",
    city: "Tacuarembó",
    category: "Música Popular Uruguaya",
    description: "",
    image: "/artists/carlin levratto.jpeg",
    avatar: "/artists/carlinavatar.jpg",
    heroVideo: "/artists/carlin levratto/carlinlevrattoclip.mp4",
    instagram: "https://www.instagram.com/carlin.levratto/",
    youtube: "https://www.youtube.com/@carlevai",
    spotify: "https://open.spotify.com/intl-es/artist/7Lq6Vty6qBho4kbSmhnckh",
    facebook: "",
                releases: [
  {
    title: "El Viaje",

    type: "EP",

    cover: "/artists/releases/El_Viaje_Cover.jpg",

    description:
      "Próximo sencillo que marcará el inicio de una nueva etapa artística.",

    status: "Lanzado",

    releaseDate: "Diciembre 2025",

    
  },
  
],
  },

  {
    slug: "johann-heyss",
    name: "JOHANN HEYSS",
    legalName: "Alexandre Gomes Soares",
    country: "BRASIL",
    countryCode: "br",
    city: "Rio de Janeiro",
    category: "Electrónico / Pop",
    description: "",
    image: "/artists/johann heyss.jpeg",
    avatar: "/artists/johanavatar.jpg",
    heroVideo: "/artists/johann heyss/johannheyssclip.mp4",
    instagram: "https://www.instagram.com/johannheyss/",
    youtube: "https://www.youtube.com/@JohannHeyssVideos",
    spotify: "https://open.spotify.com/intl-pt/artist/1iQU6w9tV52V9ElHIhqxlS?si=44E3GuG0S3C1nx0QeEQddg",
    facebook: "https://www.facebook.com/HeyssJohann",
     releases: [
  {
    title: "Adepto",

    type: "Album",

    cover: "/artists/releases/Adepto_Cover.jpg",

    description:
      "Próximo sencillo que marcará el inicio de una nueva etapa artística.",

    status: "Lanzado",

    releaseDate: "Junio 2026",

    
  },
  
],
  },

 

  {
  slug: "amys-band",
  name: "AMY'S BAND",
  legalName: "Valeria Amy Vázquez",
  country: "Uruguay",
  countryCode: "uy",
  city: "Montevideo",
  category: "Música Popular Uruguaya",
  description: "",
  image: "/artists/amysband.jpeg",
  avatar: "/artists/amyavatar.jpg",
  heroVideo: "/artists/amys band/amysbandclip.mp4",
  instagram: "https://www.instagram.com/amy_sbandstudio/",
  facebook: "",
  youtube: "https://www.youtube.com/channel/UCxxOUibNVeQUC4zCT1H3duA",
  spotify: "",
},
];