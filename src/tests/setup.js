import '@testing-library/jest-dom'

// Limpiamos mocks y localStorage entre cada test para aislarlos
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})
