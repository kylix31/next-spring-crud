import validateCPFCNPJ from "@/components/helpers/validates"

describe("validateCPFCNPJ", () => {
  it("should return true for a valid CPF number", () => {
    expect(validateCPFCNPJ("123.456.789-09")).toBe(true)
  })

  it("should return true for a valid CNPJ number", () => {
    expect(validateCPFCNPJ("88.390.466/0001-91")).toBe(true)
  })

  it("should return false for an invalid number", () => {
    expect(validateCPFCNPJ("123.456.789-01")).toBe(false)
  })

  it("should return false for an invalid length", () => {
    expect(validateCPFCNPJ("123.456")).toBe(false)
  })

  it("should return false for a number with all same digits", () => {
    expect(validateCPFCNPJ("111.111.111-11")).toBe(false)
  })
})
