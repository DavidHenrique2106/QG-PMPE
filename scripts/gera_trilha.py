"""Gera public/data/trilha.js a partir da aba "O que focar" da planilha de análise.
Ordem: todos os URGENTE (na ordem da planilha/PDF) e depois todos os MÉDIO.
Uso: python3 scripts/gera_trilha.py"""
import json
from pathlib import Path
import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
MAT = {"Língua Portuguesa": "port", "História de Pernambuco": "hist", "Raciocínio Lógico": "mat",
       "Informática": "info", "Direito Constitucional": "const",
       "Direitos Humanos e Legislação Extravagante": "dh"}
ws = openpyxl.load_workbook(RAIZ / "analise/Analise-PMPE-Soldado-2026.xlsx")["O que focar"]
itens = []
for prio, sigla in (("URGENTE", "U"), ("MÉDIO", "M")):
    for r in range(5, 40):
        if ws.cell(r, 1).value != prio:
            continue
        itens.append({
            "id": f"r{r}",  # linha da planilha: estável enquanto a planilha não for reordenada
            "p": sigla,
            "m": MAT[ws.cell(r, 2).value],
            "a": ws.cell(r, 3).value,
            "q": ws.cell(r, 4).value,
            "h": ws.cell(r, 7).value,
            "por": ws.cell(r, 5).value,
            "como": ws.cell(r, 6).value,
        })
saida = RAIZ / "public/data/trilha.js"
saida.write_text("/* Trilha de estudo: assuntos URGENTE e depois MÉDIO, na ordem do PDF de análise.\n"
                 "   Gerado por scripts/gera_trilha.py a partir de analise/Analise-PMPE-Soldado-2026.xlsx. */\n"
                 "window.QG_TRILHA=" + json.dumps(itens, ensure_ascii=False, indent=0) + ";\n", encoding="utf-8")
print(len(itens), "assuntos;", sum(i["p"] == "U" for i in itens), "URGENTE")
