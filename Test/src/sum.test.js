const sum = new Function(`a`, `b`, `{return a + b}`);


test('Sum two numbers', () => {
    expect(sum(2, 3)).toBe(5);
})