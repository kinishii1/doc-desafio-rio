---
sidebar_position: 1
---

# Desafios 1-10

Resolução dos desafios 1-10.

## Criando constantes

Inicialmente decidi criar constantes para armazenar os nomes das tabelas e as datas que serão utilizadas nas consultas.

```python
ATENDIMENTO_TABLE = "`datario.adm_central_atendimento_1746.chamado`"
BAIRRO_TABLE = "`datario.dados_mestres.bairro`"
EVENTOS_TABLE = "`datario.turismo_fluxo_visitantes.rede_hoteleira_ocupacao_eventos`"
DATE = '2023-04-01'
PERTURBAÇAO = "Perturbação do sossego"
PERIODO_PERTURBAÇAO = "'2022-01-01' AND '2023-12-31'"
```

## Criando função de consulta

Para evitar ficar repetindo o mesmo código, decidi criar uma função que recebe a query e retorna o resultado da consulta.

```python
def get_df(query):
  df = bd.read_sql(query, billing_project_id="desafio-rio")
  return display(df)
```

## Separando subqueries

Com intuito de facilitar a leitura do código, decidi separar as subqueries.

```python
subquery = f"""
SELECT
e.evento, DATE(c.data_inicio) AS data_inicio, DATE(c.data_fim) AS data_fim, COUNT(c.id_chamado) AS total_chamados
        FROM
            {ATENDIMENTO_TABLE} c
            INNER JOIN {EVENTOS_TABLE} e ON (
                DATE(c.data_inicio) BETWEEN e.data_inicial AND e.data_final
            )
        WHERE
            c.subtipo = "Perturbação do sossego"
        GROUP BY
            e.evento, data_inicio, data_fim
"""

query = f"""
SELECT subquery.evento, SUM(subquery.total_chamados) / (
        DATE_DIFF (
            MAX(subquery.data_fim), MIN(subquery.data_inicio), DAY
        ) + 1
    ) AS media_diaria
FROM (
        {subquery}
    ) AS subquery
GROUP BY
    subquery.evento
ORDER BY media_diaria DESC
LIMIT 1;
"""

get_df(query)
```

<!-- ![Docs Version Dropdown](./img/resultado-q1.PNG) -->
