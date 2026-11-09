import Image from "next/image";
import Link from "next/link";

import Motion from "./Motion";
import styles from "./expediente-del-artista.module.css";

/* ═══════════════════════════════════════════════════════════════
   EDITAR ACÁ — es lo único que hay que tocar.

   PRECIO → el precio único del sistema, tal cual se muestra.
   (Ojo: el monto que se cobra se cambia en Hotmart, no acá.)
   ═══════════════════════════════════════════════════════════════ */
const PRECIO = "USD 4,20";

/* Link de pago: pegar acá la URL del checkout cuando esté lista. */
const LINK_PAGO = "https://pay.hotmart.com/Q107431346I";

/* Frases de la cinta que corre bajo el título */
const CINTA = [
  "Nivel 1",
  "28 partes",
  "El cruce",
  "8 convocatorias",
  "Sin cuenta, sin internet",
];

/* Lo que trae el sistema: los seis grupos y sus partes, tal cual
   aparecen en el menú del Expediente (EXPEDIENTE - SISTEMA.html) */
const GRUPOS = [
  {
    n: "Empezar",
    partes: "Cómo se usa · De dónde sale esto · Qué te están pidiendo · El cruce",
  },
  {
    n: "Lo que tenés",
    partes: "Tu expediente · Tu agenda · Tus enlaces · Tus archivos originales",
  },
  {
    n: "Lo que mandás",
    partes:
      "Booking · Te dijeron que sí · Cuánto cobrar · Media kit · Gacetilla de prensa · Rider y ficha técnica · Tu versión en inglés · Tus postulaciones",
  },
  {
    n: "Lo que viene",
    partes: "Lanzar un single · Convocatorias · El año del proyecto · Qué cuesta salir",
  },
  {
    n: "Lo que tenés que saber",
    partes:
      "Institucionalidad · El acuerdo entre ustedes · Lo que te van a pedir · Tu equipo · Lo que no hay que hacer · Papeles mínimos",
  },
  {
    n: "Tu archivo",
    partes: "Guardar y exportar · Nivel 2",
  },
];

/* Los seis niveles del Nivel 1 (XP necesaria para cada uno) */
const NIVELES = [
  ["Expediente abierto", "0", "Todavía no hay nada escrito. Todo lo que sigue ya existe: falta ponerlo en algún lado."],
  ["Tu proyecto existe", "250", "Ya hay un proyecto con nombre y con obra escrita."],
  ["Tenés con qué contestar", "700", "Si alguien te escribe hoy preguntando quién sos, tenés qué responder sin salir a buscar nada."],
  ["Tenés con qué mandar", "1.250", "Podés escribirle a un lugar y mandarle material sin improvisar."],
  ["Tenés con qué negociar", "1.900", "Sabés cuánto cobrar, qué preguntar antes de decir que sí y cómo insistir sin ser pesado."],
  ["Expediente completo", "2.600", "Tu proyecto está entero y por escrito. Se abre el Nivel 2."],
];

/* Brasas del fondo: posición, tamaño, duración y demora fijas (sin
   azar) para que el servidor y el navegador dibujen lo mismo */
const BRASAS = [
  [6, 3, 19, 0, 30], [14, 2, 24, 6, -20], [23, 4, 21, 12, 40], [31, 2, 27, 3, -35],
  [42, 3, 18, 9, 25], [51, 2, 26, 15, -15], [60, 4, 22, 1, 35], [68, 2, 25, 11, -40],
  [77, 3, 20, 5, 20], [85, 2, 28, 14, -25], [93, 3, 23, 8, 15], [37, 2, 30, 18, -30],
];

/* ─────────────────────────────────────────────────────────────── */

export default function SalesPage() {
  return (
    <div className={styles.page} id="expediente">
      <Motion rootId="expediente" />

      {/* Fondo vivo: resplandores que respiran, grilla con zoom y brasas */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.orbs}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.embers}>
          {BRASAS.map(([x, s, d, dl, dx]) => (
            <span
              key={x}
              style={
                {
                  "--x": `${x}%`,
                  "--s": `${s}px`,
                  "--d": `${d}s`,
                  "--dl": `-${dl}s`,
                  "--dx": `${dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className={styles.top}>
        <div className={styles.wrap}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/LOGO1.png"
              alt="Darkside UY"
              width={26}
              height={26}
              className={styles.mark}
            />{" "}
            DARKSIDE <span style={{ color: "var(--redb)" }}>UY</span>
          </Link>
          <a className={styles.topcta} href="#precio">
            Quiero el sistema
          </a>
        </div>
      </div>

      <div className={styles.wrap}>
        {/* 1 · HERO */}
        <div className={styles.hero}>
          <div className={styles.ghost} aria-hidden="true">
            01
          </div>
          <div className={styles.eyebrow}>Nivel 1 · Para los que comentaron</div>

          <h1>
            <span className={styles.line}>
              <span>EXPEDIENTE</span>
            </span>{" "}
            <span className={styles.line}>
              <span>
                DEL <span className={styles.r}>ARTISTA</span>
              </span>
            </span>
          </h1>

          <div className={styles.lede}>
            No es un curso. <b>Es un sistema que pone por escrito todo lo
            que tu proyecto ya tiene</b>, lo cruza, te muestra lo que tenías
            adelante sin verlo y arma con tus datos los mensajes, el media kit
            y las postulaciones.
          </div>

          <div className={styles.said}>
            <div className={styles.q}>«Quiero trabajar con ustedes.»</div>
            <div className={styles.a}>
              Lo escribieron más de dos mil personas. Vos fuiste una de
              ellas.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.run}>
              {CINTA.map((frase) => (
                <span key={frase}>{frase}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.wrap}>
        {/* 2 · POR QUE NO PODEMOS TOMARLOS A TODOS */}
        <section>
          <div className={styles.kicker}>Empecemos por lo incómodo</div>

          <h2>
            No podemos tomarlos <span className={styles.r}>a todos.</span>
          </h2>

          <p>
            Trabajar con un artista de verdad significa meses de producción, identidad visual, contenido,
            gestión de fechas y postulaciones. Eso no se hace con dos mil
            personas. No se hace ni con cincuenta.
          </p>

          <p>Podríamos no haber contestado nunca. Nos pareció peor.</p>

          <p>
            Trabajando con artistas apareció lo mismo una y otra vez:{" "}
            <b>lo que el artista necesitaba ya existía, y era invisible.</b>{" "}
            Un escenario importante que nadie había escrito en ningún lado. Un
            contacto que ya había dicho que sí. Una grabación terminada
            esperando desde hace dos años.
          </p>

          <p>
            <b>Así que hicimos otra cosa:</b> construimos un sistema para
            encontrar eso, y separamos la parte que un artista puede llevarse
            y usar solo. No es el servicio. Es lo que hay antes del servicio —
            y es lo que casi ningún artista tiene.
          </p>
        </section>

        {/* 3 · QUE ES */}
        <section>
          <div className={styles.kicker}>Qué es exactamente</div>

          <h2>
            Un sistema que <span className={styles.r}>cruza.</span>
          </h2>

          <div className={styles.sub}>
            Lo que frena a la mayoría de los proyectos no es lo que les
            falta: es lo que tienen y no pueden mostrar, porque está repartido
            en seis lugares y en la cabeza de alguien.{" "}
            <b>Cargás una vez lo que tu proyecto tiene, y todo lo demás lee de
            ahí.</b>
          </div>

          <div className={styles.mocks} data-stagger>
            <div className={styles.mock} data-spot>
              <div className={styles.cap}>El cruce · Lo que no estabas viendo</div>
              <div className={styles.ringrow}>
                <div className={styles.ring}>
                  <i data-count="41" data-suffix="%">41%</i>
                </div>
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div className={`${styles.gap} ${styles.g}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>Martina ya trabajó con vos</b>
                      <span>Una presentación suya vale más que diez mensajes fríos.</span>
                    </div>
                  </div>
                  <div className={`${styles.gap} ${styles.y}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>Tenés 3 temas grabados sin publicar</b>
                      <span>Lo que falta es el trámite, no la música.</span>
                    </div>
                  </div>
                  <div className={`${styles.gap} ${styles.rr}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>No tenés un video en vivo</b>
                      <span>Nadie programa a ciegas.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mock} data-spot>
              <div className={styles.cap}>Convocatorias · ¿Estás en condiciones?</div>
              <div className={styles.trow}>
                <div style={{ color: "#f2f2f4" }}>SXSW · Austin</div>
                <span className={`${styles.chip} ${styles.go}`}>4 de 6</span>
              </div>
              <div className={styles.trow}>
                <div style={{ color: "#f2f2f4" }}>Circulart · Medellín</div>
                <span className={`${styles.chip} ${styles.go}`}>3 de 5</span>
              </div>
              <div className={styles.trow}>
                <div style={{ color: "#f2f2f4" }}>Fondos nacionales de cultura</div>
                <span className={`${styles.chip} ${styles.ok}`}>Listo</span>
              </div>
              <div className={`${styles.trow} ${styles.hoy}`}>
                <div className={styles.tag} style={{ width: "auto", color: "#ef4444" }}>
                  Te falta
                </div>
                <div className={styles.caret} style={{ marginLeft: "auto", color: "#9a9aa4" }}>
                  video en vivo
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 10 }}>
                Ocho convocatorias, cruzadas con lo que ya cargaste. Te dice
                qué te falta para cada una.
              </div>
            </div>

            <div className={`${styles.mock} ${styles.wide}`} data-spot>
              <div className={styles.cap}>Booking · El mensaje que sí se abre</div>
              <div className={styles.fakeTa}>
                Hola,{" "}
                <span className={styles.generic}>
                  somos una banda nueva y todavía estamos arrancando
                </span>
                , perdón por molestarte…
              </div>
              <div className={`${styles.cnt} ${styles.bad}`}>
                ⚠ Lo que nunca va. No mientas: simplemente no abras con tu
                punto más débil.
              </div>
              <div style={{ height: 14 }} />
              <div className={styles.fakeTa} style={{ whiteSpace: "pre-line" }}>
                {`Hola Laura, ¿cómo andás?
Soy Marea Baja, proyecto de rock de Paysandú, desde 2019.
Tocamos en la Patria Gaucha en 2023.
Te escribo para saber cómo se postula a la próxima edición, y qué material necesitan.`}
              </div>
              <div className={styles.cnt}>
                ✓ Armado con los datos de tu expediente. Se copia con un botón.
              </div>
            </div>
          </div>

          <div className={styles.blocks} data-stagger>
            {GRUPOS.map((grupo, i) => (
              <div
                key={grupo.n}
                className={i === GRUPOS.length - 1 ? `${styles.blk} ${styles.last}` : styles.blk}
                data-spot
              >
                <div className={styles.n}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <b>{grupo.n}</b>
                  <span>{grupo.partes}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 22, fontSize: 14, color: "var(--mut)" }}>
            28 partes en seis grupos. <b>No hay orden obligatorio</b>, y
            también hay un camino corto si no sabés por dónde empezar. Se
            guarda solo, funciona sin internet y no hay cuenta ni contraseña.{" "}
            <b>Todo lo que escribís queda en tu equipo</b> — no se envía a
            ningún lado, ni siquiera a nosotros. Y lo descargás como archivo
            para que no dependa de nada.
          </p>
        </section>

        {/* 4 · QUE VAS A TENER */}
        <section>
          <div className={styles.kicker}>Cuando lo llenes</div>

          <h2>
            Qué vas a <span className={styles.r}>tener.</span>
          </h2>

          <div className={styles.sub}>
            Cargar lo básico lleva unos cuarenta minutos. Completarlo entero
            es trabajo de varias semanas, porque hay cosas que vas a tener que
            ir a buscar. <b>Esa búsqueda es el producto.</b>
          </div>

          <div className={styles.res} data-stagger>
            <div>
              Tu proyecto entero y por escrito, en un solo lugar: canciones,
              antecedentes, contactos, enlaces y dónde está cada archivo
              original.
            </div>
            <div>
              Lo que se puede verificar de vos, separado de lo que solo se
              dice. Es lo que distingue a los que consiguen fechas.
            </div>
            <div>
              Los mensajes de booking, recontacto y prensa armados con tus
              datos, listos para copiar.
            </div>
            <div>
              El contenido de tu media kit listo para pasar al diseño, y tu
              rider, tu presupuesto y tu carta de condiciones en PDF.
            </div>
            <div>
              Cuánto te cuesta salir a tocar y cuánto pedir — y si lo que te
              ofrecen cubre tu número o estás pagando por tocar.
            </div>
            <div>
              Qué te falta para postular a ocho convocatorias, de SXSW y
              Circulart a los fondos de cultura, cruzado con lo que ya
              cargaste.
            </div>
            <div>
              Las doce frases que te van a escribir —«mandame tu EPK»,
              «pasame el rider», «¿tenés ISRC?»— traducidas, y si las tenés o
              no.
            </div>
            <div>
              Lo que nadie te cuenta: derechos de autor y de intérprete,
              masters, ISRC, tu marca y el acuerdo entre ustedes.
            </div>
          </div>
        </section>

        {/* 5 · NIVELES */}
        <section>
          <div className={styles.kicker}>Cómo avanza</div>

          <h2>
            Nivel 1 <span className={styles.r}>de varios.</span>
          </h2>

          <p>
            Cada cosa que cargás suma experiencia. No es un juego por el
            juego: <b>el número sube cuando tu proyecto queda mejor
            documentado</b>, y eso es exactamente lo que te hace falta el día
            que alguien te pida algo.
          </p>

          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>Nivel</th>
                  <th>Qué significa</th>
                </tr>
              </thead>
              <tbody data-stagger>
                {NIVELES.map(([nombre, xp, texto], i) => (
                  <tr key={nombre} className={i === NIVELES.length - 1 ? styles.now : undefined}>
                    <td>
                      <span className={styles.lvn}>{i + 1}</span>
                      <b>{nombre}</b>
                      <em className={styles.xp}>{xp} XP</em>
                    </td>
                    <td>{texto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <b>Cuando tu expediente está completo, se abre el Nivel 2.</b> No
            repite nada de este: arranca donde este termina. Subís tu
            expediente y sigue desde ahí, con los puntos que ganaste. Deja de
            ser sobre lo que tenés y pasa a ser sobre lo que hacés con eso.
          </p>

          <p>
            Está bloqueado y no escondido, porque lo que viene después solo
            sirve si lo de acá está hecho. <b>No hay truco para
            desbloquearlo: se llena el expediente y se abre.</b>
          </p>
        </section>

        {/* 6 · PRECIO */}
        <section id="precio">
          <div className={styles.kicker}>El precio</div>

          <h2>
            Lo que <span className={styles.r}>cuesta.</span>
          </h2>

          <div className={styles.price}>
            <div className={styles.new}>{PRECIO}</div>
            <div className={styles.cur}>Pago único</div>

            <div className={styles.credit}>
              Y esto:{" "}
              <b>
                si después trabajamos juntos, ese monto se te descuenta
                entero del primer mes.
              </b>{" "}
              No es un descuento parcial ni un cupón. Es el total.
            </div>

            <a className={styles.buy} href={LINK_PAGO || "#"}>
              Quiero el sistema
            </a>
            <div className={styles.pay}>
              Tarjeta de crédito o débito (incluye Prex, Midinero y prepagas
              habilitadas para pagos internacionales) o PayPal. Si estás fuera
              de Uruguay, contás con varios métodos de pago que se ajustan a
              tus necesidades. Todos los pagos se procesan a través de
              Hotmart, plataforma líder en venta de productos digitales en
              Latinoamérica, con más de 20 años en el mercado y protocolos de
              seguridad certificados.
            </div>
          </div>
        </section>

        {/* 7 · LO QUE NO ES */}
        <section>
          <div className={styles.kicker}>Para que nadie se lleve una sorpresa</div>

          <h2>
            Lo que <span className={styles.r}>no</span> es.
          </h2>

          <div className={styles.isnot} data-stagger>
            <div>
              No es un curso y no te va a enseñar a hacer música. No hay
              videos, ni clases, ni módulos que ver.
            </div>
            <div>
              No te va a conseguir fechas. No las consigue un sistema. Te deja
              en condiciones de salir a buscarlas.
            </div>
            <div>
              No graba, no edita y no diseña. El contenido del media kit lo
              escribís vos; el diseño conviene que lo haga alguien que sabe.
            </div>
            <div>
              No es asesoría legal. Todo lo legal lo lee un abogado
              especializado, antes de firmar, siempre.
            </div>
            <div>
              No es una asesoría. Si lo comprás esperando que alguien haga el
              trabajo por vos, no lo compres.
            </div>
            <div>
              No es una suscripción ni una plataforma. No te registrás en
              ningún lado y lo que escribís no sale de tu equipo.
            </div>
          </div>

          <p style={{ marginTop: 22 }}>
            No vas a encontrar en el sistema un solo lugar donde te empujemos
            a contratarnos. <b>Si llenás todo, vas a llegar solo a los lugares
            donde falta alguien.</b> Ahí sabés dónde encontrarnos.
          </p>
        </section>

        {/* CIERRE */}
        <div className={styles.close} data-auto>
          <h2>
            Demostranos que
            <br />
            no <span className={styles.r}>funciona.</span>
          </h2>
          <p>
            Llenalo entero y decinos que no apareció nada que no estuvieras
            viendo.
          </p>
          <a className={styles.buy} href="#precio">
            Empezar hoy
          </a>
        </div>
      </div>

      <footer>DARKSIDE UY · Productora Cultural · Mercedes, Soriano, Uruguay</footer>
    </div>
  );
}
