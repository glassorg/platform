
type Invalidatable = {
    invalidate(...args: any[]);
    markDirty?();
}

export default Invalidatable
