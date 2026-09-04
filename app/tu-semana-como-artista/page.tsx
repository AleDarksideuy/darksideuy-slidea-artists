"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./tu-semana-como-artista.module.css";

/* ═══════════════════════════════════════════════════════════════
   EDITAR ACÁ — es lo único que hay que tocar.

   FIN_LANZAMIENTO → hasta cuándo vale el precio de lanzamiento.
   Es UNA fecha, no un ciclo semanal: el archivo se vende todos
   los días y el precio sube una sola vez, el día que dice acá.

   Cuando faltan más de 7 días muestra la fecha.
   En la última semana aparece el contador.
   Pasada la fecha, el precio cambia solo al de lista.

   Formato: año, mes-1, día, hora, minuto.
   (el mes va menos uno: enero = 0, setiembre = 8)
   ═══════════════════════════════════════════════════════════════ */
const FIN_LANZAMIENTO = new Date(2026, 8, 30, 23, 59);
const PRECIO_LANZ = "USD 15";
const PRECIO_LISTA = "USD 29";
const FECHA_TXT = "30 de setiembre";

/* Link de pago: pegar acá la URL del checkout cuando esté lista. */
const LINK_PAGO = "https://pay.hotmart.com/Q107431346I";

/* ─────────────────────────────────────────────────────────────── */

const DIA = 86400000;

type Phase = "far" | "counting" | "closed";

type Countdown = { d: number; h: number; m: number; s: number };

function computeTick(): { phase: Phase; countdown: Countdown } {
  const falta = FIN_LANZAMIENTO.getTime() - Date.now();

  if (falta <= 0) {
    return { phase: "closed", countdown: { d: 0, h: 0, m: 0, s: 0 } };
  }

  if (falta > 7 * DIA) {
    return { phase: "far", countdown: { d: 0, h: 0, m: 0, s: 0 } };
  }

  const s = Math.floor(falta / 1000);
  return {
    phase: "counting",
    countdown: {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    },
  };
}

export default function TuSemanaComoArtistaPage() {
  const [phase, setPhase] = useState<Phase>("far");
  const [countdown, setCountdown] = useState<Countdown>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  useEffect(() => {
    const tick = () => {
      const next = computeTick();
      setPhase(next.phase);
      setCountdown(next.countdown);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const precioActual = phase === "closed" ? PRECIO_LISTA : PRECIO_LANZ;
  const curLbl = phase === "closed" ? "Precio de lista" : "Precio de lanzamiento";
  const afterTxt =
    phase === "far"
      ? `Vale ${PRECIO_LANZ.replace("USD ", "")} hasta el ${FECHA_TXT}. Después queda en ${PRECIO_LISTA.replace("USD ", "")}.`
      : phase === "counting"
        ? `Después de esto queda en ${PRECIO_LISTA.replace("USD ", "")} y no vuelve a bajar.`
        : "";

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.wrap}>
          <div className={styles.brand}>
            <Image
              src="/LOGO1.png"
              alt="Darkside UY"
              width={26}
              height={26}
              className={styles.mark}
            />{" "}
            DARKSIDE <span style={{ color: "var(--redb)" }}>UY</span>
          </div>
          <a className={styles.topcta} href="#precio">
            Quiero el archivo
          </a>
        </div>
      </div>

      <div className={styles.wrap}>
        {/* 1 · LO QUE DIJISTE */}
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Para los que comentaron</div>

          <h1>
            TU SEMANA
            <br />
            COMO <span className={styles.r}>ARTISTA</span>
          </h1>

          <div className={styles.lede}>
            Siete días, tres cosas por día. Siete bloques que se completan de
            a uno, y se terminan. <b>Arrancan el día que abrís el archivo</b>{" "}
            — no el lunes, no cuando empiece el mes. Al día 7 sabés
            exactamente en qué estás parado, porque lo calcula con tus
            propios datos.
          </div>

          <div className={styles.said}>
            <div className={styles.q}>«Quiero trabajar con ustedes.»</div>
            <div className={styles.a}>
              Lo escribieron más de dos mil personas. Vos fuiste una de
              ellas.
            </div>
          </div>
        </div>

        {/* 2 · POR QUE NO PODEMOS TOMARLOS A TODOS */}
        <section>
          <div className={styles.kicker}>Empecemos por lo incómodo</div>

          <h2>
            No podemos tomarlos <span className={styles.r}>a todos.</span>
          </h2>

          <p>
            Somos una productora chica. Trabajar con un artista de verdad
            significa meses de producción, identidad visual, contenido,
            gestión de fechas y postulaciones. Eso no se hace con dos mil
            personas. No se hace ni con cincuenta.
          </p>

          <p>Podríamos no haber contestado nunca. Nos pareció peor.</p>

          <p>
            <b>Así que hicimos otra cosa:</b> agarramos el sistema con el que
            ordenamos a nuestros artistas y lo convertimos en un archivo que
            podés usar solo, sin nosotros. No es el servicio. Es lo que hay
            antes del servicio — y es lo que casi ningún artista tiene.
          </p>
        </section>

        {/* 3 · QUE ES */}
        <section>
          <div className={styles.kicker}>Qué es exactamente</div>

          <h2>
            Un archivo que <span className={styles.r}>calcula.</span>
          </h2>

          <div className={styles.sub}>
            No es un PDF. No es una plantilla de Notion. Es una herramienta
            que se llena, se guarda sola y te devuelve un diagnóstico con
            números.
          </div>

          <div className={styles.mocks}>
            <div className={styles.mock}>
              <div className={styles.cap}>Bloque 07 · Dónde estás parado</div>
              <div className={styles.ringrow}>
                <div className={styles.ring}>
                  <i>74%</i>
                </div>
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div className={`${styles.gap} ${styles.g}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>Ficha técnica lista</b>
                      <span>Ya la podés mandar hoy mismo.</span>
                    </div>
                  </div>
                  <div className={`${styles.gap} ${styles.y}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>Te faltan 2 pilares</b>
                      <span>
                        Todo tu contenido le habla a quien ya te sigue.
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.gap} ${styles.rr}`}>
                    <div className={styles.dot} />
                    <div>
                      <b>Documentación incompleta</b>
                      <span>Así se pierden los fondos.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.mock}>
              <div className={styles.cap}>Bloque 04 · Tu ficha técnica</div>
              <div className={styles.trow}>
                <div className={styles.tag} style={{ width: "auto", color: "#9a9aa4" }}>
                  Formato
                </div>
                <div style={{ marginLeft: "auto", color: "#f2f2f4" }}>
                  Trío eléctrico
                </div>
              </div>
              <div className={styles.trow}>
                <div className={styles.tag} style={{ width: "auto", color: "#9a9aa4" }}>
                  Duración
                </div>
                <div style={{ marginLeft: "auto", color: "#f2f2f4" }}>
                  45 minutos
                </div>
              </div>
              <div className={styles.trow}>
                <div className={styles.tag} style={{ width: "auto", color: "#9a9aa4" }}>
                  Canales
                </div>
                <div style={{ marginLeft: "auto", color: "#f2f2f4" }}>
                  8 + 2 retornos
                </div>
              </div>
              <div className={styles.trow} style={{ borderColor: "rgba(220,38,38,.45)" }}>
                <div className={styles.tag} style={{ width: "auto", color: "#ef4444" }}>
                  Backline
                </div>
                <div style={{ marginLeft: "auto", color: "#9a9aa4" }}>
                  sin completar
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 10 }}>
                Ocho campos, con un ejemplo de cómo se responde bien al lado
                de cada uno. Se copia entera con un botón.
              </div>
            </div>

            <div className={`${styles.mock} ${styles.wide}`}>
              <div className={styles.cap}>Bloque 05 · Tus textos</div>
              <div className={styles.fakeTa}>
                Somos una banda que busca transmitir emociones a través de la
                música, con influencias de varios géneros.
              </div>
              <div className={`${styles.cnt} ${styles.bad}`}>
                ⚠ Hay una frase genérica ahí adentro. Cambiala por un dato:
                año, ciudad, formación, un lugar donde tocaste.
              </div>
              <div style={{ height: 14 }} />
              <div className={styles.fakeTa}>
                Trío de rock indie de Paysandú. Tres discos desde 2019.
                Cantamos en español.
              </div>
              <div className={styles.cnt}>76 de 150 — está en medida</div>
            </div>
          </div>

          <div className={styles.blocks}>
            <div className={styles.blk}>
              <div className={styles.n}>01</div>
              <div>
                <b>Tus siete días</b>
                <span>Tres cosas por día. Arrancan cuando abrís el archivo.</span>
              </div>
            </div>
            <div className={styles.blk}>
              <div className={styles.n}>02</div>
              <div>
                <b>Tu material dormido</b>
                <span>
                  Convierte lo que ya grabaste en piezas posibles. Casi
                  siempre sorprende.
                </span>
              </div>
            </div>
            <div className={styles.blk}>
              <div className={styles.n}>03</div>
              <div>
                <b>Tus cuatro pilares</b>
                <span>Te muestra a quién le estás hablando y a quién no.</span>
              </div>
            </div>
            <div className={styles.blk}>
              <div className={styles.n}>04</div>
              <div>
                <b>Tu ficha técnica</b>
                <span>Lo primero que pide un lugar. Se copia con un botón.</span>
              </div>
            </div>
            <div className={styles.blk}>
              <div className={styles.n}>05</div>
              <div>
                <b>Tus textos</b>
                <span>Las tres biografías, con detector de frases genéricas.</span>
              </div>
            </div>
            <div className={styles.blk}>
              <div className={styles.n}>06</div>
              <div>
                <b>Tus fechas del año</b>
                <span>
                  Ventanas de fondos y los papeles que hay que tener antes.
                </span>
              </div>
            </div>
            <div className={styles.blk} style={{ borderColor: "rgba(220,38,38,.35)" }}>
              <div className={styles.n}>07</div>
              <div>
                <b>Dónde estás parado</b>
                <span>El diagnóstico. Seis ejes, calculado con todo lo de arriba.</span>
              </div>
            </div>
          </div>

          <p style={{ marginTop: 22, fontSize: 14, color: "var(--mut)" }}>
            Funciona sin conexión. No hay que instalar nada ni crear ninguna
            cuenta. <b>Todo lo que escribís queda guardado en tu navegador</b>{" "}
            — no viaja a ningún servidor, ni siquiera al nuestro.
          </p>
        </section>

        {/* 4 · QUE HACE POR VOS ESTA SEMANA */}
        <section>
          <div className={styles.kicker}>A los siete días</div>

          <h2>
            Qué vas a tener <span className={styles.r}>el día 7.</span>
          </h2>

          <div className={styles.sub}>
            No en tres meses. En una semana, empiece el día que empiece.
          </div>

          <div className={styles.res}>
            <div>
              Tu ficha técnica escrita y lista para mandar, sin tener que
              pensarla de nuevo nunca más.
            </div>
            <div>
              Tus tres biografías —la de una línea, la de un párrafo y la
              larga— resueltas.
            </div>
            <div>
              El número real de piezas de contenido que ya tenés grabadas y
              no estás usando.
            </div>
            <div>
              Tres lugares contactados con la ficha y la bio adjuntas, que es
              como se contesta un mensaje.
            </div>
            <div>
              Los papeles que te faltan para presentarte a un fondo,
              identificados uno por uno.
            </div>
            <div>
              Y un diagnóstico que te dice, sin vueltas, qué podés resolver
              solo y qué no.
            </div>
          </div>
        </section>

        {/* 5 · SE TERMINA */}
        <section>
          <div className={styles.kicker}>Un dato que preferimos decirte</div>

          <h2>
            Esto se <span className={styles.r}>termina.</span>
          </h2>

          <p>
            Son siete jornadas y después no hay más tareas. No es una
            suscripción, no es un sistema infinito y no te va a estar
            pidiendo cosas dentro de tres meses.
          </p>

          <p>
            <b>Lo que escribiste queda tuyo para siempre.</b> La ficha
            técnica, las tres biografías, los papeles, el conteo de tu
            material: todo sigue abierto y editable en el archivo, sin
            límite de tiempo. Lo único que termina son las tareas diarias.
          </p>

          <div className={styles.tw}>
            <table>
              <thead>
                <tr>
                  <th>Qué resuelve</th>
                  <th>Qué no</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tener la ficha técnica escrita</td>
                  <td>Trabajar un lanzamiento entero</td>
                </tr>
                <tr>
                  <td>Tener las tres biografías</td>
                  <td>Sostener la publicación semana a semana</td>
                </tr>
                <tr>
                  <td>Saber qué papeles te faltan</td>
                  <td>Hacer seguimiento de los lugares en el tiempo</td>
                </tr>
                <tr>
                  <td>Saber en qué estás parado</td>
                  <td>Medir tus números mes a mes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            La columna de la izquierda se hace una vez y queda hecha.{" "}
            <b>La de la derecha es otro trabajo, y no entra en siete días.</b>{" "}
            Preferimos decirlo ahora que te lo prometas vos solo.
          </p>
        </section>

        {/* 6 · PRECIO */}
        <section id="precio">
          <div className={styles.kicker}>El precio</div>

          <h2>
            Lo que <span className={styles.r}>cuesta.</span>
          </h2>

          <div className={styles.price}>
            {phase === "closed" && (
              <div className={styles.closed}>
                <b>El precio de lanzamiento terminó.</b> El archivo sigue
                disponible al precio de lista.
              </div>
            )}

            {phase === "counting" && (
              <div className={styles.count}>
                <div className={styles.cu}>
                  <b>{countdown.d}</b>
                  <span>días</span>
                </div>
                <div className={styles.cu}>
                  <b>{countdown.h}</b>
                  <span>horas</span>
                </div>
                <div className={styles.cu}>
                  <b>{countdown.m}</b>
                  <span>min</span>
                </div>
                <div className={styles.cu}>
                  <b>{countdown.s}</b>
                  <span>seg</span>
                </div>
              </div>
            )}

            {phase !== "closed" && <div className={styles.old}>{PRECIO_LISTA}</div>}
            <div className={styles.new}>{precioActual}</div>
            <div className={styles.cur}>{curLbl}</div>
            {afterTxt && <div className={styles.after}>{afterTxt}</div>}

            <div className={styles.credit}>
              Y esto:{" "}
              <b>
                si después trabajamos juntos, ese monto se te descuenta
                entero del primer mes.
              </b>{" "}
              No es un descuento parcial ni un cupón. Es el total.
            </div>

            <a className={styles.buy} href={LINK_PAGO || "#"}>
              Quiero el archivo
            </a>
            <div className={styles.pay}>
Tarjeta de crédito o débito (incluye Prex, Midinero y prepagas habilitadas para pagos internacionales) o PayPal. Si estás fuera de Uruguay, contás con varios métodos de pago que se ajustan a tus necesidades. Todos los pagos se procesan a través de Hotmart, plataforma líder en venta de productos digitales en Latinoamérica, con más de 20 años en el mercado y protocolos de seguridad certificados.            </div>
          </div>
        </section>

        {/* 7 · LO QUE NO ES */}
        <section>
          <div className={styles.kicker}>Para que nadie se lleve una sorpresa</div>

          <h2>
            Lo que <span className={styles.r}>no</span> es.
          </h2>

          <div className={styles.isnot}>
            <div>No es un curso. No hay videos, ni clases, ni módulos que ver.</div>
            <div>
              No es una plantilla para completar y guardar. Está hecho para
              abrirlo todos los días.
            </div>
            <div>
              No te va a conseguir fechas ni prensa. Te va a dejar en
              condiciones de salir a buscarlas.
            </div>
            <div>No graba, no edita y no diseña. Eso es trabajo de equipo, y es otra conversación.</div>
            <div>
              No es una asesoría. Si lo comprás esperando que alguien haga
              el trabajo por vos, no lo compres.
            </div>
            <div>
              No es un sistema infinito. Son siete jornadas y se acaban. Lo
              que cargues queda tuyo, pero las tareas terminan el día 7.
            </div>
          </div>

          <p style={{ marginTop: 22 }}>
            Lo decimos así de claro porque preferimos vender menos y que
            quien lo compre sepa qué está comprando.
          </p>
        </section>

        {/* CIERRE */}
        <div className={styles.close}>
          <h2>
            Siete días haciendo
            <br />
            tres cosas <span className={styles.r}>por día.</span>
          </h2>
          <p>Suena poco. Fijate cuántas veces lo lograste.</p>
          <a className={styles.buy} href="#precio">
            Empezar hoy
          </a>
        </div>
      </div>

      <footer>DARKSIDE UY · Productora Cultural · Mercedes, Soriano, Uruguay</footer>
    </div>
  );
}
