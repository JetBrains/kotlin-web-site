import spring from './images/spring.svg';
import ktor from './images/ktor.svg';
import micronaut from './images/micronaut-foundation.svg';
import quarkus from './images/quarkus-dark.svg';
import vaadin from './images/vaadin-dark.svg';
import cubaPlatform from './images/cuba-platform-dark.svg';
import vertx from './images/vertx-dark.svg';
import http4k from './images/http4k-dark.svg';
import javalin from './images/javalin.svg';
import kafkaLogo from './images/kafka.svg';


export const primaryCardsData = [
    {
        title: 'Spring',
        src: spring,
        text:
            'With its versatile set of features, Spring is the world’s most popular Java framework. When it’s paired with Kotlin, and its concise syntax, the two make the ultimate combo for application development.',
        linkHref: 'https://spring.io/guides/tutorials/spring-boot-kotlin/',
        linkText: 'Read tutorial'
    },
    {
        title: 'Ktor',
        src: ktor,
        text:
            'Ktor is a multiplatform toolkit built by JetBrains for creating Web applications in Kotlin. It makes use of coroutines for high scalability and offers an easy-to-use API.',
        linkHref: 'https://ktor.io/quickstart/',
        linkText: 'How to start'
    }
];

export const secondaryCardsData = [
  {
    title: 'Micronaut',
    src: micronaut,
    text:
      'Build your next Kotlin microservice application with ease and test it, too.',
    linkHref:
      'https://guides.micronaut.io/creating-your-first-micronaut-app-kotlin/guide/index.html',
    linkText: 'Learn more'
  },
  {
    title: 'Quarkus',
    src: quarkus,
    text:
      'Looking to implement the next cloud-native service with Kotlin? Try Quarkus!',
    linkHref: 'https://quarkus.io/guides/kotlin',
    linkText: 'Learn more'
  },
  {
    title: 'Vaadin',
    src: vaadin,
    text:
      'Create web applications with great-looking UI using Java and Kotlin.',
    linkHref: 'https://vaadin.com/kotlin',
    linkText: 'Learn more'
  },
  {
    title: 'Cuba platform',
    src: cubaPlatform,
    text:
      'This full-stack framework with a wide range of add-ons is a great fit for business application development with Kotlin.',
    linkHref: 'http://cuba-platform.com/kotlin',
    linkText: 'Learn more'
  },
  {
    title: 'Vert.x',
    src: vertx,
    text: 'A tool-kit for building reactive applications on the JVM.',
    linkHref: 'https://vertx.io/docs/vertx-core/kotlin/',
    linkText: 'Learn more'
  },
  {
    title: 'HTTP4K',
    src: http4k,
    text:
      'The HTTP toolkit written in pure Kotlin. Enables the serving and consuming of HTTP services in a functional and consistent way.',
    linkHref: 'https://www.http4k.org/',
    linkText: 'Learn more'
  },
  {
    title: 'Javalin',
    src: javalin,
    text: 'A lightweight Java and Kotlin framework.',
    linkHref: 'https://javalin.io/',
    linkText: 'Learn more'
  },
  {
    title: 'Apache Kafka',
    src: kafkaLogo,
    text:
      'Build event-driven, scalable applications effortlessly in Kotlin using Apache Kafka, the industry-standard platform for real-time data streaming.',
    linkHref: 'https://kafka.apache.org/',
    linkText: 'Learn more'
  }
];
