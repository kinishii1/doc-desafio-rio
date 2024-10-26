---
sidebar_position: 1
---

# Desafios 1-4

Resolução dos desafios 1-4.

## Respostas das Questões

```python
Q1 O total de 15 feriados em 2024.
Q2 O mês com mais feriados é 11
Q3 O total de 10 feriados em 2024 que caem em dias de semana.
Q4 A média de temperatura por mês é {'01': '26.69 °C', '02': '27.21 °C', '03': '26.44 °C', '04': '25.15 °C', '05': '25.02 °C', '06': '22.65 °C', '07': '21.1 °C', '08': '21.2 °C'}
```

## Questão 1

### Quantos feriados há no Brasil em todo o ano de 2024?

Utilizando a biblioteca `aiohttp` para fazer requisições assíncronas, apenas foi necessario fazer uma requisição `GET` para a API de feriados públicos e contar o total de feriados retornados.

```python
async def count_holidays_year():
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL_HOLIDAY) as response:
            holidays = await response.json()
            total_holidays = len(holidays)
            answers.append(f"Q1 O total de {total_holidays} feriados em 2024.")
```

## Questão 2

### Qual mês de 2024 tem o maior número de feriados?

Formato de resposta da API de feriados:

```json
{
  "date": "2024-01-01",
  "localName": "Confraternização Universal",
  "name": "New Year's Day",
  "countryCode": "BR",
  "fixed": false,
  "global": true,
  "counties": null,
  "launchYear": null,
  "types": ["Public"]
}
```
Aqui foi necessario extrair o mês de cada feriado e contar quantos feriados existem em cada mês.

Utilizei da estraégia de criar um dicionário onde a chave é o mês e o valor é a quantidade de feriados que vai  ser incrementado a cada feriado encontrado.

Depois apenas foi necessário pegar o mês com o maior número de feriados com a função `max`.

```python
async def month_most_holidays():
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL_HOLIDAY) as response:
            holidays_per_month = {}

            holidays = await response.json()

            for holiday in holidays:
                month = holiday["date"].split("-")[1]
                holidays_per_month[month] = holidays_per_month.get(month, 0) + 1

            answers.append(
                f"Q2 O mês com mais feriados é {max(holidays_per_month, key=holidays_per_month.get)}"
            )
```

## Questão 3

### Quantos feriados em 2024 caem em dias de semana (segunda a sexta-feira)?

Formato de resposta da API de feriados:

```json
{
  "date": "2024-01-01",
  "localName": "Confraternização Universal",
  "name": "New Year's Day",
  "countryCode": "BR",
  "fixed": false,
  "global": true,
  "counties": null,
  "launchYear": null,
  "types": ["Public"]
}
```
Aqui foi necessario transformar a data do feriado em um objeto `datetime` e utilizar o metodo `strptime` para fazer o parse da data.

Depois precisaria alguma forma de representar o datetime em dia da semana, então utilizei a função `strftime` com o formato `%A` que retorna o dia da semana por extenso.

```python
async def count_holidays_weekdays():
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL_HOLIDAY) as response:
            holidays = await response.json()
            weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            count = 0
            for holiday in holidays:
                holiday_date = datetime.strptime(holiday["date"], "%Y-%m-%d")
                if holiday_date.strftime("%A") in weekdays:
                    count += 1
            answers.append(
                f"Q3 O total de {count} feriados em 2024 que caem em dias de semana."
            )
```

## Questão 4

### Qual foi a temperatura média em cada mês?

Formato de resposta da API de tempo:

```json
{
  "daily": [
    {
      "time": ["2024-01-01"],
      "temperature_2m_mean":	[24.9],
    }
  ]
}
```
Nesta questão foi um pouco mais dificil, pois a API retorna a data e a temperatura em listas separadas, então foi necessário iterar sobre as listas e somar a temperatura de cada dia.

Utilizei do index do loop para acessar a temperatura do dia correspondente, pois percebi que cada lista referia-se ao seu correspondente do mesmo index.

Para economizar um `if else` para verificar se o mês já foi adicionado ao dicionário, utilizei o método `get` do dicionário que retorna o valor da chave se ela existir, caso contrário retorna o valor padrão passado como segundo argumento.

E por fim foi apenas necessário dividir a soma da temperatura pelo total de dias do mês e arredondar para 2 casas decimais adicionando a unidade de medida por ultimo.

```python
async def get_mean_temp_month():
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL_MEDIA_MENSAL) as response:
            data = await response.json()
            mean_temp_month = {}
            count_days_month = {}

            for i, day in enumerate(data["daily"]["time"]):
                month = day.split("-")[1]
                mean_temp_month[month] = (
                    mean_temp_month.get(month, 0)
                    + data["daily"]["temperature_2m_mean"][i]
                )
                count_days_month[month] = count_days_month.get(month, 0) + 1

            for month in mean_temp_month:
                mean_temp_month[month] /= count_days_month[month]
                mean_temp_month[month] = str(round(mean_temp_month[month], 2)) + " °C"

            answers.append(f"Q4 A média de temperatura por mês é {mean_temp_month}")

```
