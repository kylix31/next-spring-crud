/**
 * Validates a given CPF or CNPJ number.
 * @param number The CPF or CNPJ number to validate.
 * @returns A boolean indicating whether the number is valid (true) or not (false).
 */
export default function validateCPFCNPJ(number: string): boolean {
  // Remove all non-digit characters from the input
  const cleanedNumber = number.replace(/\D/g, "")

  if (cleanedNumber.length === 11) {
    // CPF validation
    return validateCPF(cleanedNumber)
  } else if (cleanedNumber.length === 14) {
    // CNPJ validation
    return validateCNPJ(cleanedNumber)
  }

  // Invalid length, not a valid CPF or CNPJ
  return false
}

/**
 * Validates a given CPF number.
 * @param cpf The CPF number to validate.
 * @returns A boolean indicating whether the CPF is valid (true) or not (false).
 */
function validateCPF(cpf: string): boolean {
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  // Validate CPF digits
  const cpfDigits = cpf.split("").map(Number)
  const verifierDigit1 = cpfDigits[9]
  const verifierDigit2 = cpfDigits[10]

  // Calculate the first verification digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += cpfDigits[i] * (10 - i)
  }
  let calculatedVerifierDigit1 = (sum * 10) % 11
  if (calculatedVerifierDigit1 === 10) {
    calculatedVerifierDigit1 = 0
  }

  // Calculate the second verification digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += cpfDigits[i] * (11 - i)
  }
  let calculatedVerifierDigit2 = (sum * 10) % 11
  if (calculatedVerifierDigit2 === 10) {
    calculatedVerifierDigit2 = 0
  }

  // Check if the calculated digits match the provided digits
  return (
    verifierDigit1 === calculatedVerifierDigit1 &&
    verifierDigit2 === calculatedVerifierDigit2
  )
}

/**
 * Validates a given CNPJ number.
 * @param cnpj The CNPJ number to validate.
 * @returns A boolean indicating whether the CNPJ is valid (true) or not (false).
 */
function validateCNPJ(cnpj: string): boolean {
  // Check if all digits are the same
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  // Validate CNPJ digits
  const cnpjDigits = cnpj.split("").map(Number)
  const verifierDigit1 = cnpjDigits[12]
  const verifierDigit2 = cnpjDigits[13]

  // Calculate the first verification digit
  let sum = 0
  let multiplier = 5
  for (let i = 0; i < 12; i++) {
    sum += cnpjDigits[i] * multiplier
    multiplier = multiplier === 2 ? 9 : multiplier - 1
  }
  let calculatedVerifierDigit1 = sum % 11
  if (calculatedVerifierDigit1 < 2) {
    calculatedVerifierDigit1 = 0
  } else {
    calculatedVerifierDigit1 = 11 - calculatedVerifierDigit1
  }

  // Calculate the second verification digit
  sum = 0
  multiplier = 6
  for (let i = 0; i < 13; i++) {
    sum += cnpjDigits[i] * multiplier
    multiplier = multiplier === 2 ? 9 : multiplier - 1
  }
  let calculatedVerifierDigit2 = sum % 11
  if (calculatedVerifierDigit2 < 2) {
    calculatedVerifierDigit2 = 0
  } else {
    calculatedVerifierDigit2 = 11 - calculatedVerifierDigit2
  }

  // Check if the calculated digits match the provided digits
  return (
    verifierDigit1 === calculatedVerifierDigit1 &&
    verifierDigit2 === calculatedVerifierDigit2
  )
}
