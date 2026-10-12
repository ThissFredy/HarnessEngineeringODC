import caminar01 from '../assets/sprites/kai/frames/caminar-01.svg'
import caminar02 from '../assets/sprites/kai/frames/caminar-02.svg'
import caminar03 from '../assets/sprites/kai/frames/caminar-03.svg'
import caminar04 from '../assets/sprites/kai/frames/caminar-04.svg'
import senalar01 from '../assets/sprites/kai/frames/senalar-01.svg'
import senalar02 from '../assets/sprites/kai/frames/senalar-02.svg'
import senalar03 from '../assets/sprites/kai/frames/senalar-03.svg'
import hablar01 from '../assets/sprites/kai/frames/hablar-01.svg'
import hablar02 from '../assets/sprites/kai/frames/hablar-02.svg'
import hablar03 from '../assets/sprites/kai/frames/hablar-03.svg'
import sonreir01 from '../assets/sprites/kai/frames/sonreir-01.svg'
import sonreir02 from '../assets/sprites/kai/frames/sonreir-02.svg'
import sonreir03 from '../assets/sprites/kai/frames/sonreir-03.svg'
import llorar01 from '../assets/sprites/kai/frames/llorar-01.svg'
import llorar02 from '../assets/sprites/kai/frames/llorar-02.svg'
import llorar03 from '../assets/sprites/kai/frames/llorar-03.svg'
import negar01 from '../assets/sprites/kai/frames/negar-01.svg'
import negar02 from '../assets/sprites/kai/frames/negar-02.svg'
import negar03 from '../assets/sprites/kai/frames/negar-03.svg'
import acertar01 from '../assets/sprites/kai/frames/acertar-01.svg'
import acertar02 from '../assets/sprites/kai/frames/acertar-02.svg'
import acertar03 from '../assets/sprites/kai/frames/acertar-03.svg'
import kaiSenalarBase from '../assets/sprites/kai/kai-senalar-base.svg'
import kaiAcertarBase from '../assets/sprites/kai/kai-acertar-base.svg'

export const KAI_ANIMATIONS = {
  caminar: {
    label: 'Caminar',
    description: 'Paso corto en ciclo continuo.',
    frameDuration: 170,
    frames: [
      { src: caminar01, transform: 'translateY(0)' },
      { src: caminar02, transform: 'translate(-2px, -3px) rotate(-1deg)' },
      { src: caminar03, transform: 'translateY(0)' },
      { src: caminar04, transform: 'translate(2px, -3px) rotate(1deg)' },
    ],
  },
  senalar: {
    label: 'Señalar',
    description: 'Gesto de indicación con el índice levantado.',
    base: kaiSenalarBase,
    frameDuration: 280,
    frames: [
      { src: senalar01, transform: 'translateY(0)' },
      { src: senalar02, transform: 'translateY(-2px)' },
      { src: senalar03, transform: 'translateY(0)' },
    ],
  },
  hablar: {
    label: 'Hablar',
    description: 'Apertura y cierre de boca.',
    frameDuration: 180,
    frames: [
      { src: hablar01, transform: 'translateY(0)' },
      { src: hablar02, transform: 'translateY(-1px)' },
      { src: hablar03, transform: 'translateY(0)' },
    ],
  },
  sonreir: {
    label: 'Sonreír',
    description: 'Sonrisa amplia con ojos alegres.',
    frameDuration: 260,
    frames: [
      { src: sonreir01, transform: 'translateY(0)' },
      { src: sonreir02, transform: 'translateY(-2px)' },
      { src: sonreir03, transform: 'translateY(0)' },
    ],
  },
  llorar: {
    label: 'Llorar',
    description: 'Lágrimas que caen por las mejillas.',
    frameDuration: 320,
    frames: [
      { src: llorar01, transform: 'translateY(0)' },
      { src: llorar02, transform: 'translateY(1px)' },
      { src: llorar03, transform: 'translateY(0)' },
    ],
  },
  negar: {
    label: 'Negar',
    description: 'Movimiento lateral de cabeza.',
    frameDuration: 240,
    frames: [
      { src: negar01, transform: 'translateX(-4px) rotate(-2deg)' },
      { src: negar02, transform: 'translateX(4px) rotate(2deg)' },
      { src: negar03, transform: 'translateX(-3px) rotate(-1deg)' },
    ],
  },
  acertar: {
    label: 'Acertar',
    description: 'Afirmación con pulgar arriba.',
    base: kaiAcertarBase,
    frameDuration: 250,
    frames: [
      { src: acertar01, transform: 'translateY(0)' },
      { src: acertar02, transform: 'translateY(-5px)' },
      { src: acertar03, transform: 'translateY(0)' },
    ],
  },
}
