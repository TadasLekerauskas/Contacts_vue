export const handleError = (errorCode: string): string => {
  if (errorCode == 'ERR_NETWORK') {
    return 'Klaida jungiantis su serveriu'
  } else if (errorCode == 'ECONNABORTED') {
    return 'Klaida, nutrauktas prisijungimas su serveriu'
  } else {
    return 'Klaida imant duomenis iš duomenų bazės'
  }
}
