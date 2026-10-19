# PRimer

> Tu cartilla de primeros issues: un asistente con IA que te ayuda a encontrar tu primera contribución open source.

🔗 **Demo:** Próximamente

Acá va una foto !!!!!!!! <!-- TODO: no te olvides-->

---

## ¿Qué es PRimer?

PRimer es un chat con IA que, a partir de lo que sabés y lo que te interesa, busca en GitHub issues abiertos pensados para principiantes, te explica de qué se tratan y te deja guardar los que querés encarar.

**¿Por qué "PRimer"?** El nombre juega con tres sentidos:

- *primer* (inglés): la capa de base que va antes de todo, como cuando recién empezás a formarte.
- *primer* (inglés): una cartilla o manual introductorio. PRimer es una cartilla de issues.
- *primer* (español): de primero, porque busca tus primeros issues. Y las letras **PR**, de *pull request*.

## Definición del bot

**Problema que resuelve.** Iniciarse en el desarrollo puede ser difícil, y GitHub al principio es poco intuitivo. Los buscadores existentes devuelven miles de issues sin contexto: muchos están viejos, ya asignados o en repos abandonados, y un junior no tiene forma rápida de saber cuál le conviene.

**Público objetivo.** Estudiantes y desarrolladores junior que quieren hacer su primera contribución open source, sumar experiencia real y llenar su GitHub.

**Propuesta de valor.** En lugar de armar búsquedas con filtros, le contás al bot en lenguaje natural qué sabés (*"sé un poco de Python y me gusta lo web"*). PRimer traduce eso en una búsqueda precisa, descarta los issues que no valen la pena, te explica cada uno de manera simple, con link a la fuente, y te guarda los que te interesan.

## User stories

### 1. Encontrar issues según mis lenguajes

**Como** estudiante o dev junior,
**quiero** filtrar los issues según los lenguajes que manejo,
**para** encontrar fácilmente los que puedo resolver.

Criterios de aceptación:
- [ ] El sistema reconoce en el texto qué lenguajes maneja el usuario y con qué nivel.
- [ ] El sistema aplica filtros por lenguaje a la búsqueda de issues.
- [ ] El sistema muestra los issues filtrados con título, repo, etiquetas y link al issue original.
- [ ] Si no hay resultados, el bot sugiere ampliar o cambiar la búsqueda.

### 2. Entender si un issue me conviene

**Como** dev junior,
**quiero** que el bot me explique un issue y el estado de su repositorio,
**para** decidir si vale la pena encararlo antes de invertir tiempo.

Criterios de aceptación:
- [ ] El bot resume en lenguaje simple qué pide el issue.
- [ ] El bot consulta el repo y muestra si está activo (última actividad, estrellas, issues abiertos).
- [ ] La respuesta cita la fuente con link a GitHub.
- [ ] Si la API de GitHub falla, el bot lo informa con un mensaje claro en vez de inventar datos.

### 3. Guardar issues para más tarde

**Como** estudiante,
**quiero** guardar los issues que me interesan y volver a verlos,
**para** organizar mis próximas contribuciones.

Criterios de aceptación:
- [ ] Puedo pedirle al bot en lenguaje natural que guarde un issue.
- [ ] Puedo pedirle que me muestre mis issues guardados.
- [ ] Los issues guardados y mis conversaciones siguen ahí al recargar la página.