import Languages from "../constants/languages.json"

export function textToSpeechCode(sourceCode) {
  const values = Object.values(Languages)
  for (var i = 0; i < values.length; i++) {
    if (values[i]["text"] === sourceCode) {
      return values[i]["speech"]
    }
  }
  return null
}

export function speechToTextCode(sourceCode) {
  const values = Object.values(Languages)
  for (var i = 0; i < values.length; i++) {
    if (values[i]["speech"] === sourceCode) {
      return values[i]["text"]
    }
  }
  return null
}

export function textToLanguage(sourceCode) {
  const values = Object.values(Languages)
  for (var i = 0; i < values.length; i++) {
    if (values[i]["text"] === sourceCode) {
      return Object.keys(Languages)[i]
    }
  }
  return null
}
