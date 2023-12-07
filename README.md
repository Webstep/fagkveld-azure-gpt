# Fagkveld med GPT i Azure

## Lage GPT-instans i Azure

1. Logg inn i Azure på https://portal.azure.com
2. Gå inn på Azure OpenAI: https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/OpenAI
3. Trykk Create
4. Enten lag en ny ressursgruppe (kall den `rg-fagkveld-<ditt-navn>`) eller velg en eksisterende (`rg-alle-sammen`)
5. Velg region. Her har du et par alternativer:
   1. East US, France Central, Sweden Central - har nesten alle GPT-modeller tilgjengelig
   2. Norway Central - har kun GPT-4, men den nyeste og raskeste - og den ligger i Norge
   3. East US og Sweden Central er de eneste som kan generere bilder
6. Kall den for `aoai-fagkveld-<ditt-navn>`, trykk
7. Velg Pricing tier: Standatrd S0
8. Next -> Next -> Next -> Create
9. Vent til den er ferdig med å deploy. Kan ta et minutt.
10. Gå inn på "Overview" og trykk på "Go to Azure OpenAI Studio" øverst
11. Gå til "Management" > "Deployments"
12. Trykk på "Create new deployment"
13. Velg modell og gjerne bare kall den det samme som modellen, for enkelthets skyld
14. Gjerne også juster TPM (Tokens Per Minute) til noe lavere enn maks, og behold "Enable Dynamic Quota" på. Vi har bare X tokens per region, så vi må dele på de.
15. Trykk "Create"

## Test GPT-instansen

I Azure OpenAI Studio, gå til "Playground" > "Chat". Her kan du gå til "Chat Session" og trykke "View Code". Velg "curl" i dropdownen. Her får du en curl-kommando som du kan kjøre i terminalen din. Denne kan du bruke til å teste ut modellen din.

```bash
curl "https://aoai-alle-sammen.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2023-07-01-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d "{
  \"messages\": [{\"role\":\"system\",\"content\":\"You are an AI assistant that helps people find information.\"}],
  \"max_tokens\": 800,
  \"temperature\": 0.7,
  \"frequency_penalty\": 0,
  \"presence_penalty\": 0,
  \"top_p\": 0.95,
  \"stop\": null
}"
```

`$AZURE_OPENAI_API_KEY` finner du som "Key" i bunnen av denne oversikten.

## Teste ut dette prosjektet med din egen GPT-instans

Kopier `.env.local.example` til `.env.local` og fyll inn:

```bash
AZURE_OPENAI_API_KEY= # Key fra Azure
AZURE_OPENAI_API_BASE_URL=https://resource-name.openai.azure.com # Endpoint in Azure
AZURE_OPENAI_API_MODEL=gpt-4 # Deployment name in Azure
AZURE_OPENAI_API_VERSION=2023-12-01-preview
```

## Kjøre UI

```bash
npm install
npm run dev
```
