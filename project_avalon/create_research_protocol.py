import json
import os


def create_research_protocol():
    print("📝 Gerando protocolos de pesquisa Arkhé...")

    research_matrix = [
        ("Arkhe-PTSD", "Reset de memórias traumáticas via re-padronização temporal"),
        ("Arkhe-ADHD", "Sincronização de redes atenção default/executiva"),
        ("Arkhe-Creativity", "Indução de estados hipnagógicos dirigidos"),
        ("Arkhe-Aging", "Reversão de marcadores epigenéticos do estresse"),
    ]

    protocol_doc = """# PROTOCOLO DE PESQUISA AVALON: ARKHÉ

## Visão Geral
O Arkhé Visualizer e Soundscape servem como o núcleo de re-sincronização neurofisiológica.

## Matriz de Aplicações:
"""
    for i, (name, desc) in enumerate(research_matrix, 1):
        protocol_doc += f"{i}. **{name}**: {desc}\n"

    protocol_doc += """
## Métricas de Monitoramento:
1. Coerência Inter-hemisférica (EEG)
2. Variabilidade da Frequência Cardíaca (HRV)
3. Entropia Espectral Neural
"""

    with open("project_avalon/session_data/RESEARCH_PROTOCOLS.md", "w") as f:
        f.write(protocol_doc)

    print(
        "✅ Protocolo de pesquisa gerado em project_avalon/session_data/RESEARCH_PROTOCOLS.md"
    )


if __name__ == "__main__":
    create_research_protocol()
