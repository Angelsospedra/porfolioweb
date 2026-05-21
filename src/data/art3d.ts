export interface Art3DItem {
  id: string
  title: string
  description: string
  thumb: string
  model: string
  images?: string[]
  video?: string
  link: string
  year: number
}

export const art3dItems: Art3DItem[] = [
  
   {
    id: 'cañon',
    title: 'Stylized Canon',
    description: 'Modelado en Maya y Zbrush. Texturizado en Substance Painter. Renderizado en Marmoset Toolbag',
    thumb: `${import.meta.env.BASE_URL}thumbs/canon.png`,
    model: `${import.meta.env.BASE_URL}models/canon.glb`,
    link:"https://www.artstation.com/artwork/KeDzrr",
    year: 2023,
   },
   {
    id: 'lamp',
    title: 'Realistic Lamp',
    description: 'Modelado en Maya. Texturizado en Substance Painter. Renderizado en Marmoset Toolbag',
    thumb: `${import.meta.env.BASE_URL}thumbs/lamp.png`,
    model: `${import.meta.env.BASE_URL}models/lamp.glb`,
    link:"https://www.artstation.com/artwork/m803NE",
    year: 2023,
   },
   {
    id: 'ak',
    title: 'Realistic AK',
    description: 'Modelado en 3DMax. Texturizado en Substance Painter. Renderizado en Marmoset Toolbag',
    thumb: `${import.meta.env.BASE_URL}thumbs/ak.png`,
    model: ``,
    images: [
    `${import.meta.env.BASE_URL}images/AK/1.png`,
    `${import.meta.env.BASE_URL}images/AK/2.png`,
    `${import.meta.env.BASE_URL}images/AK/3.png`,
    `${import.meta.env.BASE_URL}images/AK/4.png`,
    `${import.meta.env.BASE_URL}images/AK/5.png`,
    `${import.meta.env.BASE_URL}images/AK/6.png`,
    ],
    link:"https://www.artstation.com/artwork/KeDzrr",
    year: 2023,
   },
   {
    id: 'terror',
    title: 'Terror Environment',
    description: 'Modelado en 3DMax. Texturizado en Substance Painter. Renderizado en Unreal Engine 5',
    thumb: `${import.meta.env.BASE_URL}thumbs/terror.png`,
    model: ``,
    video: `${import.meta.env.BASE_URL}videos/1.mp4`,
    images: [
    `${import.meta.env.BASE_URL}images/Terror Environment/1.png`,
    `${import.meta.env.BASE_URL}images/Terror Environment/2.png`,
    `${import.meta.env.BASE_URL}images/Terror Environment/3.png`,
    ],
    link:"https://www.artstation.com/artwork/XnEXPl",
    year: 2023,
   },
   {
    id: 'wowsword',
    title: 'World Of Warcraft Stylized Sword',
    description: 'Modelado en 3DMax. Texturizado en Substance Painter. Renderizado en Marmoset Toolbag',
    thumb: `${import.meta.env.BASE_URL}thumbs/sword.png`,
    model: ``,
    images: [
    `${import.meta.env.BASE_URL}images/Sword/1.png`,
    `${import.meta.env.BASE_URL}images/Sword/2.png`,
    `${import.meta.env.BASE_URL}images/Sword/3.png`,
    ],
    link:"https://www.artstation.com/artwork/m803NE",
    year: 2023,
   },
]
