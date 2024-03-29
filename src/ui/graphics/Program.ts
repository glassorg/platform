import VertexFormat from "./VertexFormat.js"
import VertexShader from "./VertexShader.js"
import FragmentShader from "./FragmentShader.js"
import PositionTexture3D_VertexShader from "./effects/PositionTexture3D.vert"
import Texture_FragmentShader from "./effects/Texture.frag"
import PositionColorTexture3D_VertexShader from "./effects/PositionColorTexture3D.vert"
import PositionColorTexture2D_VertexShader from "./effects/PositionColorTexture2D.vert"
import ColorTexture_FragmentShader from "./effects/ColorTexture.frag"
import Effect from "./effects/Effect.js"
import Graphics3D from "./Graphics3D.js"

/**
 * Shader program declaration.
 * Specifies the shader sources and the vertex format.
 */
export default class Program implements Effect {

    public readonly id: string
    public readonly vertexShader: VertexShader
    public readonly fragmentShader: FragmentShader

    constructor(vertexShader: VertexShader, fragmentShader: FragmentShader) {
        this.id = `${vertexShader}:${fragmentShader}`
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
    }

    // a Program implements the most basic Effect interface
    render(g: Graphics3D, callback: (g: Graphics3D) => void) {
        let saveProgram = g.program
        g.program = this
        callback(g)
        g.program = saveProgram
    }

    toString() {
        return this.id
    }

    public static readonly default3D: Program = new Program(
        new VertexShader(VertexFormat.positionColorTexture, PositionColorTexture3D_VertexShader),
        new FragmentShader(ColorTexture_FragmentShader)
    )

    // public static readonly default3D: Program = new Program(
    //     new VertexShader(VertexFormat.positionColor, PositionColor3D_VertexShader),
    //     new FragmentShader(Color_FragmentShader)
    // )

    public static readonly default2D: Program = new Program(
        new VertexShader(VertexFormat.positionColorTexture, PositionColorTexture2D_VertexShader),
        Program.default3D.fragmentShader
    )

    public static readonly texture3D: Program = new Program(
        new VertexShader(VertexFormat.positionTexture, PositionTexture3D_VertexShader),
        new FragmentShader(Texture_FragmentShader)
    )
}