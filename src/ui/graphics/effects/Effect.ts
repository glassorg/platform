import Graphics3D from "../Graphics3D.js";

export default interface Effect {

    render(g: Graphics3D, callback: (g: Graphics3D) => void)

}