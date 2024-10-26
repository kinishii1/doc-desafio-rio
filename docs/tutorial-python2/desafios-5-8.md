---
sidebar_position: 2
---

# Desafios 5-8

Resolução dos desafios 5-8.

## Respostas das Questões

```python
Q5 O clima mais comum por mês é {'01': 'Rain', '02': 'Light Drizzle', '03': 'Light Drizzle', '04': 'Cloudy', '05': 'Light Drizzle', '06': 'Mainly Sunny', '07': 'Cloudy', '08': 'Partly Cloudy'}
Q6 A média de temperatura e tempo nos feriados é {'2024-01-01': {'temp': 24.9, 'weather_code': 51, 'temp_description': 'Light Drizzle'}, '2024-02-12': {'temp': 30.2, 'weather_code': 1, 'temp_description': 'Mainly Sunny'}, '2024-02-13': {'temp': 30.6, 'weather_code': 51, 'temp_description': 'Light Drizzle'}, '2024-03-29': {'temp': 24.9, 'weather_code': 61, 'temp_description': 'Light Rain'}, '2024-03-31': {'temp': 24.7, 'weather_code': 53, 'temp_description': 'Drizzle'}, '2024-04-21': {'temp': 23.1, 'weather_code': 2, 'temp_description': 'Partly Cloudy'}, '2024-05-01': {'temp': 28.0, 'weather_code': 0, 'temp_description': 'Sunny'}, '2024-05-30': {'temp': 20.9, 'weather_code': 51, 'temp_description': 'Light Drizzle'}, '2024-07-09': {'temp': 21.6, 'weather_code': 51, 'temp_description': 'Light Drizzle'}}
': 51, 'temp_description': 'Light Drizzle'}, '2024-07-09': {'temp': 21.6, 'weather_code': 51, 'temp_description': 'Light Drizzle'}}
Q7 Os feriados nao aproveitados são {'2024-01-01': {'temp': 24.9, 'weather': 'Light Drizzle'}, '2024-02-13': {'temp': 30.6, 'weather': 'Light Drizzle'}, '2024-03-29': {'temp': 24.9, 'weather': 'Light Rain'}, '2024-03-31': {'temp': 24.7, 'weather': 'Drizzle'}, '2024-05-30': {'temp': 20.9, 'weather': 'Light Drizzle'}, '2024-07-09': {'temp': 21.6, 'weather': 'Light Drizzle'}}
Q8 O melhor feriado foi ('2024-02-13', {'temp': 30.6, 'weather': 'Light Drizzle'})
```

## Questão 5

### Qual foi o tempo predominante em cada mês nesse período?

Formato de resposta da API de clima:

```json
{
  "daily": [
    {
      "time": ["2024-01-01"],
      "temperature_2m_mean": [24.9]
    }
  ]
}
```

Aqui foi precisei do `defaultdict` para acessar as chaves que não existem sem gerar um erro.

Primeiramente precisar contar um por um o clima de cada dia e mês, para isso criei um dicionário onde a chave é o mês e o valor é outro dicionário onde a chave é o código do clima e o valor é a quantidade de vezes que ele aparece.

Posteiormente pegamos o código do clima mais comum de cada mês.

Depois abrimos o arquivo com a definição dos códigos de clima e substituimos o código pelo nome do clima.

```python
async def most_commom_weather_month():
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL_WEATHER_CODE) as response:
            data = await response.json()
            weather_month = defaultdict(lambda: defaultdict(int))

            for i, day in enumerate(data["daily"]["time"]):
                month = day.split("-")[1]
                weather_code = data["daily"]["weather_code"][i]
                weather_month[month][weather_code] += 1

            most_common_weather = {}
            for month, weather_codes in weather_month.items():
                most_common_weather_code = max(weather_codes, key=weather_codes.get)
                most_common_weather[month] = most_common_weather_code

            with open("respostas\Python\descriptions.json", "r") as file:
                description_data = json.load(file)

            for month, weather_code in most_common_weather.items():
                most_common_weather[month] = description_data[str(weather_code)]["day"][
                    "description"
                ]

            answers.append(f"Q5 O clima mais comum por mês é {most_common_weather}")

```

## Questão 6

### Qual foi o tempo e a temperatura média em cada feriado de 01/01/2024 a 01/08/2024?

Formato de resposta da API de clima:

```json
{
  "daily": [
    {
      "time": ["2024-01-01"],
      "temperature_2m_mean": [24.9]
    }
  ]
}
```

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

Aqui segui a mesma logica da questão anterior. Armazenamos os feriados em uma lista.
Depois apenas foi necessario comparar as datas com os feriados para pegarmos apenas as datas corretas e adicionar as outras informaçoes.
Decidi por criar a resposta como um dicionario com os valores sendo dicionarios tambem para comportar os dados da temperatura, o código do clima e a descrição do clima.

Adicionei essa parte no final codigo para reutilizar a função em outras questões.

```python
if len(answers) == 5:
                answers.append(
                    f"Q6 A média de temperatura e tempo nos feriados é {mean_temp_holiday}"
                )
            else:
                return mean_temp_holiday
```

```python
async def mean_temp_weather_holiday():
    async with aiohttp.ClientSession() as session:
        holidays_days = []
        mean_temp_holiday = {}
        async with session.get(API_URL_HOLIDAY) as response:
            holidays = await response.json()
            for holiday in holidays:
                holidays_days.append(holiday["date"])

        async with session.get(API_URL_MEDIA_WEATHER) as response:
            data = await response.json()
            for i, day in enumerate(data["daily"]["time"]):
                if day in holidays_days:
                    mean_temp_holiday[day] = {
                        "temp": data["daily"]["temperature_2m_mean"][i],
                        "weather_code": data["daily"]["weather_code"][i],
                    }

            with open("respostas\Python\descriptions.json", "r") as file:
                description_data = json.load(file)

            for day, info in mean_temp_holiday.items():
                weather_code = info["weather_code"]
                mean_temp_holiday[day] = {
                    **info,
                    "temp_description": description_data[str(weather_code)]["day"][
                        "description"
                    ],
                }

            if len(answers) == 5:
                answers.append(
                    f"Q6 A média de temperatura e tempo nos feriados é {mean_temp_holiday}"
                )
            else:
                return mean_temp_holiday

```

## Questão 7

### Considere as seguintes suposições:

- O cidadão carioca considera "frio" um dia cuja temperatura média é menor que 20ºC;
- Um feriado bem aproveitado no Rio de Janeiro é aquele em que se pode ir à praia;
- O cidadão carioca só vai à praia quando não está com frio;
- O cidadão carioca também só vai à praia em dias com sol, evitando dias **totalmente** nublados ou chuvosos (considere _weather_code_ para determinar as condições climáticas).

Nessa questão reutilizei a função da questão 6 para pegar as informações dos feriados com a temperatura e o clima.

Depois foi apenas necessário filtrar os feriados que não são aproveitaveis seguindo as restrições dadas.

```python
async def define_bad_holiday():
    holiday_infos = await mean_temp_weather_holiday()
    bad_holidays = {}
    good_weather = [
        "Mainly Sunny",
        "Sunny",
        "Partly Cloudy",
    ]
    for day, info in holiday_infos.items():
        if float(info["temp"]) < 20 or info["temp_description"] not in good_weather:
            bad_holidays[day] = {
                "temp": info["temp"],
                "weather": info["temp_description"],
            }

    answers.append(f"Q7 Os feriados nao aproveitados são {bad_holidays}")
```

## Questão 8

### Qual foi o feriado "mais aproveitável" de 2024?

Nessa questão reutilizei a função da questão 6 para pegar as informações dos feriados com a temperatura e o clima.

Apenas inverti a lógica da questão anterior para pegar os feriados que são aproveitaveis.

Depois ordenamos os feriados pelo valor da temperatura e pegamos o primeiro.

Poderiamos considerar também a descrição do clima para desempatar, porem nao sabia o peso de cada condição.
ex: é melhor um dia com 20 graus e sol ou 25 graus e nublado?

```python
async def define_best_holiday():
    holiday_infos = await mean_temp_weather_holiday()
    good_holidays = {}
    good_weather = [
        "Sunny",
        "Mainly Sunny",
        "Partly Cloudy",
    ]
    for day, info in holiday_infos.items():
        if float(info["temp"]) > 20 or info["temp_description"] in good_weather:
            good_holidays[day] = {
                "temp": info["temp"],
                "weather": info["temp_description"],
            }

    good_holidays = sorted(
        good_holidays.items(), key=lambda x: x[1]["temp"], reverse=True
    )

    answers.append(f"Q8 O melhor feriado foi {good_holidays[0]}")
```
