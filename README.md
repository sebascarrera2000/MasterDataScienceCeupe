# 📊 SaberPro Analytics — Plataforma de Análisis y Predicción

![GitHub repo size](https://img.shields.io/github/repo-size/sebascarrera2000/saberpro-analytics?color=blue&label=Tamaño%20Repo)
![GitHub last commit](https://img.shields.io/github/last-commit/sebascarrera2000/saberpro-analytics?color=green&label=Última%20Actualización)
![Status](https://img.shields.io/badge/status-active-success)

Este repositorio contiene el desarrollo completo del **Trabajo de Fin de Máster (TFM)** en **Data Science (CEUPE)**.  
El proyecto integra **EDA de los microdatos del ICFES (Saber 11 y Saber Pro)**, un **modelo predictivo de Machine Learning**, y una **plataforma web interactiva** con APIs y un frontend moderno.  

## 🚀 Tecnologías Utilizadas

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/></a>
  <a href="https://pandas.pydata.org/"><img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white"/></a>
  <a href="https://numpy.org/"><img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white"/></a>
  <a href="https://scikit-learn.org/"><img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white"/></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/></a>
  <a href="https://recharts.org/"><img src="https://img.shields.io/badge/Recharts-0088FE?style=for-the-badge&logo=recharts&logoColor=white"/></a>
</p>


## 🎯 Objetivos

- Realizar **EDA completos** de los microdatos Saber 11 y Saber Pro.  
- Calcular el **Valor Agregado (VA)** de la Universidad Mariana.  
- Desarrollar un **modelo predictivo** con Scikit-learn.  
- Implementar APIs en **Node.js (analytics)** y **Python FastAPI (predicción)**.  
- Construir un **frontend en React + TypeScript** con visualizaciones interactivas.  

---

## 📂 Estructura del Proyecto

```
📦 saberpro-analytics
 ┣ 📁 EDAS                   # Notebooks Jupyter con EDA
 ┣ 📁 saberpro-analytics-api # API Analytics con Nodejs +Supabase
 ┣ 📁 saberpro-ml-full       # API ML con FastAPI con training
 ┣ 📁 frontend-react         # Frontend en React + TSX
 ┣ 📁 Basededatos            # Basededatos epxortados
 ┣ 📁 dataicfes.txt          # Basededatos total para poder realizar EDA
 ┗ README.md
```

---

## 🔎 Análisis Exploratorio de Datos (EDA)

- Importación de microdatos TXT con **Pandas** (`read_csv(delimiter="\t")`).  
- Limpieza y normalización de nombres con **Regex + unicodedata**.  
- Cálculo de estadísticas descriptivas: media, desviación estándar, percentiles.  
- Visualización de distribución de puntajes (histogramas, boxplots, densidades).  
- Cohortes analizadas: **2016→2020, 2017→2021, 2018→2022, 2019→2023, 2020→2024**.  

---

## 🤖 Machine Learning — Predicción Saber Pro

- Modelo principal: **HistGradientBoostingRegressor (HGBR)**.  
- Preprocesamiento con **ColumnTransformer**: imputación, escalado y codificación *one-hot*.  
- Validación con **GroupKFold** (evita fuga temporal).  
- Métricas utilizadas:
  - RMSE (Error Cuadrático Medio de Raíz).  
  - R² (Coeficiente de determinación).  
- Modelos de **quantile regression** para intervalos de predicción (q10–q90).  

📊 **Resultados del VA**  

| Cohorte   | VA Promedio | RMSE  | R²    |
|-----------|-------------|-------|-------|
| 2016–2020 | 11.54       | 9.08  | 0.126 |
| 2017–2021 | 8.73        | 8.88  | 0.098 |
| 2018–2022 | 8.27        | 12.81 | 0.220 |
| 2019–2023 | 13.60       | 8.90  | 0.397 |
| 2020–2024 | 3.95        | 9.44  | 0.399 |

✔ Todas las cohortes muestran **VA positivo**.  
✔ Máximo impacto en 2019–2023.  
✔ Retos en 2020–2024 (pospandemia).  

---

## 🌐 Arquitectura Web

<p align="center">
  <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*J3aT0cYfZfbQfVIAtF5NCg.png" alt="Arquitectura Web" width="700"/>
</p>

- **API Node.js (Analytics)**:  
  - Endpoints `/api/rank`, `/api/summary`, `/api/catalogs`.  
  - Conexión a Supabase/PostgreSQL.  
  - Documentación con Swagger.  

- **API Python (FastAPI)**:  
  - Endpoints `/api/predict`, `/api/predict/batch`, `/api/model/info`.  
  - Sirve modelos entrenados con `joblib`.  

- **Frontend React**:  
  - Librerías: Zustand, React Hook Form, Recharts.  
  - Exportación de reportes con `jspdf` + `html2canvas`.  
  - Páginas: `/predict`, `/colegios`, `/programas`, `/va`, `/report`, `/about`.  

---

## 🌍 Documentación de la API en Producción

La plataforma expone sus APIs en **Render**, con documentación interactiva generada en **Swagger (OAS 3.0)**:  

- 📑 **API Analytics (Node.js + Supabase)**  
  👉 [https://masterdatascienceceupe-1.onrender.com/docs](https://masterdatascienceceupe-1.onrender.com/docs)  

- 📑 **API SaberPro Predictiva (Python + FastAPI)**  
  👉 [https://masterdatascienceceupe.onrender.com/docs](https://masterdatascienceceupe.onrender.com/docs)  

Ambas APIs están desplegadas en la nube y documentadas bajo el estándar **OpenAPI 3.0**, con endpoints organizados para consultas, rankings, resúmenes y predicciones.

---

## ☁️ Despliegue en la Nube

Todo el ecosistema del proyecto se encuentra **100% desplegado**:

- 🗄 **Base de Datos**: Supabase (PostgreSQL + Session Pooler).  
- ⚙️ **API Analytics** (Node.js + Express) desplegada en **Render** →  
  [https://masterdatascienceceupe-1.onrender.com](https://masterdatascienceceupe-1.onrender.com)  

- 🤖 **API Predictiva SaberPro (Machine Learning, FastAPI)** en **Render** →  
  [https://masterdatascienceceupe.onrender.com](https://masterdatascienceceupe.onrender.com)  

- 🎨 **Frontend Web** en **Vercel** (React + TypeScript + Tailwind) →  
  👉 [[Frontenend](https://master-data-science-ceupe.vercel.app/)]

---



## 👨‍🎓 Autor

**Juan Sebastián Carrera Bolaños**  
- Máster en Data Science (CEUPE)  
- Profesor universitario e investigador en ciencia de datos y educación  
- GitHub: [sebascarrera2000](https://github.com/sebascarrera2000)

---

## 📚 Referencias

- McKinney, W. (2010). *Data structures for statistical computing in Python*. Proc. 9th Python in Science Conf.  
- Pedregosa, F. et al. (2011). *Scikit-learn: Machine Learning in Python*. JMLR, 12, 2825–2830.  
- Hunter, J. D. (2007). *Matplotlib: A 2D graphics environment*. Computing in Science & Engineering.  
- React Team. (2023). *React Documentation*. Meta Platforms, Inc.  
- Supabase. (2023). *Supabase Documentation*. https://supabase.com/docs  
- Toma, C., & Dinu, C. (2020). *FastAPI framework: Modern, fast web framework for Python*.  
