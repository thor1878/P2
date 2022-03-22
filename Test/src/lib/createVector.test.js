const createVector = new Function(`x`, `y`, `z`, `{return { x: x, y: y, z: z }}`);


test('Generate 3D vector', () => {
    expect(createVector(1, 2, 3)).toEqual({ x: 1, y: 2, z: 3 });
})