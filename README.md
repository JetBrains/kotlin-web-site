# Sitio web de Kotlin
[![Official project][project-badge]][project-url]
[![Qodana Code Quality Check](https://github.com/JetBrains/kotlin-web-site/actions/workflows/qodana-code-quality-check.yml/badge.svg)](https://github.com/JetBrains/kotlin-web-site/actions/workflows/qodana-code-quality-check.yml)

Este repositorio es la fuente de [https://kotlinlang.es](https://kotlinlang.es).

* [Estructura del sitio web](#website-structure)
* [Contribución](#contribution)
* [Despliegue local](#local-deployment)
* [Comentarios y problemas](#feedback-and-issues)

<a id="project-structure"></a>

## Estructura del sitio web

### Contenido

| Página web                                                      | Archivos fuente                                          |
| --------------------------------------------------------------- | -------------------------------------------------------- |
| [Página principal](https://kotlinlang.es/)                      | [templates/pages/index.html](templates/pages/index.html) |
| [Documentación de Kotlin](https://kotlinlang.es/docs/home.html) | [docs/topics](docs/topics)                               |
| [Comunidad](https://kotlinlang.es/community/)                   | [pages/community](pages/community)                       |
| [Educación](https://kotlinlang.es/education/)                   | [templates/pages/education](templates/pages/education)   |

Observa que los archivos fuente para [la página inicial de «server-side»](https://kotlinlang.org/lp/server-side/) y [la página inicial de Kotlin Multiplatform](https://kotlinlang.org/lp/multiplatform/) no están disponibles públicamente.

#### Fuentes en diferentes repositorios

Los archivos fuente de la especificación del lenguaje y la documentación sobre corutinas, lincheck, Dokka y las directrices para los creadores de librerías
se almacenan en repositorios distintos.

| Página web                                                                                                 | Repositorio de GitHub                                               |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Documentación de corutinas](https://kotlinlang.es/docs/coroutines-guide.html)                             | [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/) |
| [Documentación de Lincheck](https://kotlinlang.es/docs/lincheck-guide.html)                                | [kotlinx.lincheck](https://github.com/Kotlin/kotlinx-lincheck/)     |
| [Documentación de Dokka](https://kotlinlang.es/docs/dokka-introduction.html)                               | [Dokka](https://github.com/Kotlin/dokka/)                           |
| [Lineamientos para creadores de librerías](https://kotlinlang.esdocs/jvm-api-guidelines-introduction.html) | [api-guidelines](https://github.com/Kotlin/api-guidelines)          |
| [Especificación del lenguaje](https://kotlinlang.es/spec/introduction.html)                                | [kotlin-spec](https://github.com/Kotlin/kotlin-spec)                |

#### Contenido autogenerado

[La documentación de referencia de la API](https://kotlinlang.org/api/latest/jvm/stdlib/) se genera con base en comentarios en el código de Kotlin.
Aprende más acerca de [cómo documentar código Kotlin](https://kotlinlang.es/docs/kotlin-doc.html).

La [referencia gramatical de Kotlin](https://kotlinlang.es/docs/reference/grammar.html) la genera el [generador de gramática de Kotlin](https://github.com/Kotlin/website-grammar-generator) a partir de la
[definición de la gramática de Kotlin](https://github.com/Kotlin/kotlin-spec/tree/release/grammar/src/main/antlr).

### Archivos de configuración

| Confguración                           | Archivo                                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Navegación y estructura                | [kr.tree](docs/kr.tree) para documentación y [\_nav.yml](data/_nav.yml) para otras páginas      |
| Variables, como la versión del release | [v.list](docs/v.list) para documentación y [releases.yml](data/releases.yml) para otras páginas |
| Eventos comunitarios en el mapa        | [events.xml](data/events.yml)                                                                   |
| Lista de videos (obsoleta)             | [videos.yml](data/videos.yml)                                                                   |

### Plantillas

El sitio web de Kotlin usa plantillas [Jinja2](https://jinja.palletsprojects.com/en/2.11.x/) del directorio [plantillas](templates).
Nota cómo todos los archivos Markdown, excepto los de [docs](docs), se procesan como plantillas Jinja antes de la conversión a HTML.
Esto permite utilizar todos los beneficios de Jinja para Markdown (por ejemplo, construir URLs con la función `url_for`).

## Contribuciones

Puedes contribuir al sitio web de Kotlin enviándonos un «pull request».
También puedes [crear un *issue* en YouTrack](https://youtrack.jetbrains.com/newIssue?project=KT) para discutir tu sugerencia con el equipo de Kotlin.

Para la documentación de Kotlin, sigue [estas directrices sobre estilo y formato](https://docs.google.com/document/d/1mUuxK4xwzs3jtDGoJ5_zwYLaSEl13g_SuhODdFuh2Dc/edit?usp=sharing).

Para otras páginas, sigue toda la referencia de sintaxis del [sitio kramdown](https://kramdown.gettalong.org/syntax.html).
También puedes incluir campos de metadatos. Aprende más sobre ello en la [documentación de Jekyll](https://jekyllrb.com/docs/front-matter/).

### Grupo de Usuarios Kotlin

Para añadir un Grupo de Usuarios Kotlin (KUG, por sus siglas en inglés — *Kotlin User Group*), procede de la siguiente manera:
1. Abre el archivo de configuración [user-groups.yml](/data/user-groups.yml).
2. Busca una sección adecuada entre las existentes.
3. Añade a la sección seleccionada un nuevo grupo con las siguientes llaves:
    - `name`, el nombre del grupo.
    - `country`, el nombre del país donde se encuentra el grupo. Si se trata de un grupo virtual, utiliza «Internacional».
    - `url`, el enlace a la página web del grupo.
    - `isVirtual`, declara esta llave con valor `true` si el grupo es únicamente virtual.
    - `position`, la posición geográfica del grupo, definida por un par de llaves: `lat` y `lng`. Es preferible ejecutar `scripts/user_group`.
4. Si el grupo no es virtual, también es necesario especificar la posición del grupo.
   Puedes hacerlo manualmente añadiendo la llave `position` con los valores `lat` y `lng`, como sigue:

   ```yaml
   position:
     lat: 1.1111111
     lng: 1.1111111
   ```

   o, ejecutar el «script geo» (`scripts/user_groups_geolocator.py`) que lo hará por ti.
   Necesitas obtener GOOGLE_API_KEY y luego ejecutar el siguiente script:

   ```
   $ GOOGLE_API_KEY="..." python scripts/universities_geolocator.py
   ```

   Puedes encontrar más detalles sobre el parámetro `GOOGLE_API_KEY` en [este artículo de Google](https://developers.google.com/maps/documentation/geocoding/get-api-key).
   La forma manual a veces es mejor, porque te permite especificar la posición con mayor precisión.

Puedes ver la estructura y tipos de la configuración esperada en [el esquema JSON](/data/schemas/user-groups.json).
Una vez que publiques un «pull request», los cambios serán validados por [GitHub Actions Workflow](.github/workflows/validate-user-groups-data.yml) para evitar errores de configuración.

### Eventos comunitarios

Para agregar un evento a los Eventos comunitarios, haz lo siguiente:
1. Ingresa la información del evento en [events.yml](/data/events.yml) con lo siguiente:
   - `lang`, idioma, código de dos letras considerando el [formato ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
   - `startDate`, fecha de inicio, en el formato 'aaaa-mm-dd'.
   - `endDate`, fecha de terminación, en el formato 'aaaa-mm-dd'. Para el evento del día, provee la misma fecha que en startDate.
   - `location`, ubicación, en el formato 'Ciudad, País'. Puedes omitirlo para un evento en línea.
   - `online`, establece esta llave con valor `true` en caso de un evento online.
   - `speaker`, nombre del ponente.
   - `title`, título del evento.
   - `subject`, título de la charla.
   - `url`, enlace a la página web del evento.
   Puedes ver la estructura y tipos de la configuración esperada en [el esquema JSON](/data/schemas/events.json).
2. Publica los cambios creando un «pull request». Los cambios serán validados por [GitHub Actions Workflow](.github/workflows/validate-events-data.yml) para evitar errores de configuración.

## Despliegue local

Actualmente, no hay manera de desplegar el sitio web de Kotlin localmente. Este ticket hace seguimiento al esfuerzo de añadir soporte para pruebas locales: [KT-47049](https://youtrack.jetbrains.com/issue/KT-47049).

Puedes contribuir al sitio web de Kotlin enviándonos un «pull request».

## Comentarios y problemas

Puedes:

* Reportar un problema en [nuestro gestor de problemas](https://youtrack.jetbrains.com/newIssue?project=KT).
* Compartir comentarios en el canal [#kotlin-website](https://kotlinlang.slack.com/archives/C02B3PECK6E) en nuestro Slack público de Kotlin ([obtén una invitación](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
* Enviarnos correos electrónicos a [doc-feedback@kotlinlang.org](mailto:doc-feedback@kotlinlang.org).

[project-url]: https://confluence.jetbrains.com/display/ALL/JetBrains+en+GitHub
[project-badge]: https://jb.gg/badges/official.svg
[slack-url]: https://slack.kotlinlang.org

## Desarrollo local

#### preliminares: python3 instalado

```
# instalar dependencias frontend
yarn install

# en el primer comando start, necesitas construir el static
yarn run next-build-static

# ejecuta el servidor de NextJS
yarn run next-dev

# ejecuta el servidor webpack dev para todo lo demás
yarn start

# instalar dependencias para el servidor python
pip  install --no-build-isolation -r requirements.txt

# ejecuta el servidor python
python3 kotlin_website.py
```
Ahora puedes abrir el sitio web en [http://localhost:9000](http://localhost:9000).


## Pages on Next.js

Puedes encontrar todas las páginas en el directorio [pages](pages).

### Estructura del proyecto

- **Componentes**. Los bloques de construcción.
- **Bloques**. Los bloques son grupos de componentes unidos para formar una sección relativamente compleja y distinta de una interfaz.
- **Páginas**. Cada página está asociada a una ruta en función de su nombre de archivo.

### Imágenes en Next.js

Ten en cuenta que no es posible usar `next/image` porque Next.js no soporta la importación de imágenes a archivos HTML (SSG).
En su lugar, utiliza los componentes Img y Svg de "next-optimized-images".

# Tests

Usamos Playwright para escribir pruebas e2e y Screenshot.
Ver https://playwright.dev/ para más detalles.

## Requisitos previos

Para ejecutar pruebas localmente:
1. Instala los navegadores soportados:

   ```
   npx playwright install
   ```

2. Inicia el servidor de desarrollo.

## Ejecución de pruebas

- `yarn test` para ejecutar todas las pruebas en modo headless localmente.
- `yarn test:e2e` para ejecutar las pruebas e2e localmente, también se incluyen las pruebas visuales.
- `yarn test:e2e:skip-visual` para ejecutar localmente las pruebas e2e sin pruebas visuales.
- `yarn test:production` para ejecutar el subconjunto de pruebas e2e destinadas a comprobar producción localmente.

También hay opciones adicionales para ejecutar pruebas:
- `yarn run test:e2e:ci` o `yarn test:production:ci` para ejecutar pruebas en entornos CI.
- `yarn test:e2e:headed` o `yarn test:production:headed` para ejecutar pruebas en modo headed localmente.
- `yarn test:e2e:debug` o `yarn test:production:debug` para ejecutar pruebas e2e en modo headed con depuración, localmente.

Para facilitar el proceso de añadir y mantener pruebas e2e:
- `yarn test:e2e:new` para generar el test para las interacciones del usuario.
- `yarn test:e2e:update` para actualizar las capturas de pantalla cuando algo en la página ha cambiado intencionadamente.

## Escribir tests

Para escribir un test e2e, crea el archivo de especificaciones `/test/e2e/*tu-página*.spec.js`.

## Pruebas WebHelp
Algunas pruebas e2e se centran en prevenir regresiones en los componentes WebHelp utilizados para construir documentación en la sección /docs de kotlinlang.org.
Para ejecutar estas pruebas localmente, sigue los siguientes pasos:
1. Crea el directorio `dist` en el proyecto.
2. Abre la última compilación correcta de [Reference Docs](https://buildserver.labs.intellij.net/buildConfiguration/Kotlin_KotlinSites_KotlinlangTeamcityDsl_BuildReferenceDocs?branch=&mode=builds#all-projects) en TeamCity.
3. Descarga los artefactos de esta compilación y colócalos en el directorio `dist`.
4. Ejecuta las pruebas localmente con el siguiente comando `yarn run test:e2e`.
5. Ejecute las pruebas en el contenedor docker con el siguiente comando `docker compose -f docker-compose-e2e-statics.yml up --build --exit-code-from playwright`.

## Pruebas de referencias a la API

Algunas pruebas se centran en proteger el marcado HTML de las referencias API para que no sea corrompido por los componentes KTL de la extensión de la plantilla Dokka.
Para ejecutar estas pruebas localmente, sigue los siguientes pasos:
1. Crea el directorio `libs` en el proyecto.
2. Abre la última compilación correcta de cada referencia API en TeamCity.
3. Descarga los artefactos de estas compilaciones y colócalos en el directorio `libs` por su nombre, por ejemplo, `kotlinx.coroutines`.
4. Inicializa los contenedores `./scripts/dokka/up.sh`.
5. Ejecuta la prueba dentro del contenedor `./scripts/dokka/run.sh` o en el host con uno de los siguientes scripts.
