# 🎓 Plataforma Saber Pro – Frontend (TFM CEUPE)

[![Deploy en Vercel](https://img.shields.io/badge/Vercel-Deployed-brightgreen?logo=vercel)](https://master-data-science-ceupe.vercel.app/)  
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](#) 
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E)](#) 
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#) 
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)](#) 
[![Recharts](https://img.shields.io/badge/Recharts-FF6384?logo=chartdotjs&logoColor=white)](#)  

---

## 🖥️ Enfoque en el Frontend

Este proyecto está diseñado con **React + Vite + TypeScript** y estilizado con **TailwindCSS** para garantizar:  
- ⚡ **Rendimiento alto** gracias al bundler de Vite.  
- 🎨 **Diseño moderno y accesible** con Tailwind.  
- 📊 **Visualizaciones interactivas** mediante Recharts.  
- 📱 **Responsive Design**: interfaz usable en móviles, tablets y escritorio.  

El frontend no es un formulario estático, sino una **plataforma educativa interactiva**, con **dashboards dinámicos** y **gráficas en tiempo real**.

---

## 📂 Páginas del Frontend

### 🔮 `/predict` – Predicción individual
- Formulario de entrada para datos de **Saber 11**.  
- Validaciones integradas:
  - Global `0–500`
  - Módulos `0–100` (Matemáticas, Lectura Crítica, Sociales, Naturales, Inglés).  
- Envía datos → recibe predicción y rango de confianza.  
- **Visualización**: gráfico de líneas mostrando `y_pred`, intervalo inferior y superior.  

👉 Es la página **más importante**, donde el usuario vive la experiencia central de predicción.

---

### 🏫 `/colegios` – Explorador de colegios
- Tabla con **ranking de colegios** según media global.  
- Filtros por año y periodo.  
- Modal con gráfico de barras (rendimiento en cada área: LC, MAT, SOC, NAT, ING).  
- Etiquetas visuales (**Badges**) para mostrar el nivel de rendimiento (Excelente, Bueno, Regular, Bajo).  

👉 Una herramienta clara para **comparar instituciones educativas**.

---

### 🎓 `/programas` – Ranking de programas
- Ranking de programas académicos entre **2020–2024**.  
- Ordenados por puntaje medio.  
- Modal con detalle del programa, institución y gráfico de barras.  

👉 Orienta a los estudiantes sobre **qué programas tienen mejor desempeño**.

---

### 📈 `/va` – Valor Agregado
- Ranking del **Valor Agregado (VA)** por programa.  
- Representa la **contribución real de la institución** al aprendizaje del estudiante, más allá de su puntaje de entrada (Saber 11).  

👉 Da una mirada más justa y contextualizada que un ranking tradicional.

---

### 📖 `/about` – Metodología
Explicación técnica del modelo y los datos, presentada de forma **visual y pedagógica**:  
- Métricas del modelo (RMSE, R², MAE).  
- Importancia de variables (gráfico de barras).  
- Evolución de la precisión (línea por año).  
- Limitaciones y recomendaciones de uso.  

---

### 📝 `/report` – Reporte PDF
- Genera un **reporte descargable en PDF** con:  
  - Predicción personalizada.  
  - Intervalos de confianza.  
  - Comparación con colegio, municipio y programa.  

👉 Una funcionalidad clave para entregar resultados a estudiantes o instituciones.

---

## 🎨 Experiencia de Usuario

- **UI consistente:** Tarjetas (`Card`), botones (`Button`), alertas (`Alert`) y badges (`Badge`) diseñados con un estilo uniforme.  
- **Interacción dinámica:** Modal con gráficas interactivas al explorar colegios/programas.  
- **Accesibilidad:** Etiquetas claras, componentes con ayuda contextual, y diseño responsive.  
- **Feedback inmediato:** Loading spinners, alertas de error y confirmación al enviar predicciones.  

---

## 📊 Ejemplo de visualización de predicción

```json
{
  "y_pred": 139.20,
  "intervalo": { "inf": 135.02, "sup": 152.63 },
  "contexto": { "anio": 2025, "colegio_nombre": "Javeriano", "municipio": "Pasto" }
}
```

🔹 Representado en un **LineChart interactivo** con el valor predicho en el centro y el área sombreada del intervalo de confianza.

---

## 👨‍💻 Autor

**Juan Sebastián Carrea Bolaños**  
🎓 Máster en Data Science — CEUPE  
💻 [GitHub @sebascarrera2000](https://github.com/sebascarrera2000)  
🌐 [Demo en Vercel](https://master-data-science-ceupe.vercel.app/)  

---

🙌 Agradecimientos especiales a **CEUPE** por el acompañamiento durante este TFM.  

✨ *Un frontend pensado para transformar datos en conocimiento accesible.*  
