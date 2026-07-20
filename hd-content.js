// Texte in Annettes Stimme: kurze Sätze, Du-Anrede, "..." als Pause, kein Marketing-Ton.

const TYPE_TEXTS = {
  "Generator": "Du bist Generator. Deine Energie ist gemacht, um zu antworten, nicht um zu pushen. Wenn sich etwas nach einem klaren Ja in deinem Bauch anfühlt, hast du Kraft für den ganzen Tag, manchmal für Jahre. Wenn nicht... spürst du das auch, meistens als Frust oder Müdigkeit, die sich nicht richtig erklären lässt. Deine Aufgabe ist nicht, dir Dinge auszudenken, sondern zu warten, bis das Leben dir etwas hinhält, und dann ehrlich zu spüren: ja oder nein.",
  "Manifesting Generator": "Du bist Manifestierender Generator. Du hast die Energie eines Generators, und den Drang, direkt loszulegen, ohne auf Erlaubnis zu warten. Dein Weg: mehrere Dinge gleichzeitig, im eigenen Tempo, Umwege inklusive, ohne dich dafür erklären zu müssen. Andere kommen manchmal nicht mit deinem Tempo mit... das ist okay, das ist nicht dein Problem.",
  "Manifestor": "Du bist Manifestor. Du bist hier, um Dinge in Bewegung zu bringen, aus dir selbst heraus, nicht auf Zuruf. Dein großes Thema: andere informieren, bevor du losgehst, nicht um Erlaubnis zu bitten, sondern damit dir niemand ungewollt in den Weg kommt. Wenn man dich zu sehr einschränkt, spürst du das körperlich, oft als Wut. Das ist dein Signal, nicht dein Fehler.",
  "Projector": "Du bist Projector. Deine Kraft liegt im Sehen und Führen, nicht im ständigen Tun. Du brauchst Einladung und Anerkennung, um wirklich gehört zu werden, und Pausen, die dir niemand streitig machen darf. Deine Energie ist nicht für einen Acht-Stunden-Rhythmus gemacht, egal was dir die Welt erzählt hat. Wenn du dich bitter fühlst, ist das oft ein Zeichen, dass du zu lange ungesehen warst.",
  "Reflector": "Du bist Reflector. Selten und besonders, du spiegelst die Menschen und die Umgebung um dich herum, fast wie ein Mond. Dein Rhythmus: ein ganzer Mondzyklus, ca. 28 Tage, bevor große Entscheidungen sich wirklich richtig anfühlen. Die Menschen um dich herum entscheiden mehr über dein Wohlbefinden als bei jedem anderen Typ, wähl sie bewusst."
};

const STRATEGY_TEXTS = {
  "Generator": {
    label: "Warten und Reagieren",
    text: "Warte, bis dir etwas begegnet, das dich wirklich anspricht, ein Angebot, eine Frage, eine Gelegenheit. Reagiere aus dem Bauch, statt selbst aktiv loszurennen und Dinge zu erzwingen."
  },
  "Manifesting Generator": {
    label: "Warten, Reagieren, Informieren",
    text: "Wie ein Generator wartest du auf Resonanz, bevor du losgehst. Aber wenn du dann startest, informiere die Menschen um dich, damit dein Tempo und deine Sprünge niemanden überrumpeln."
  },
  "Manifestor": {
    label: "Informieren",
    text: "Bevor du handelst, sag den Menschen, die es betrifft, was du vorhast. Nicht um Erlaubnis zu bitten, nur damit sie Bescheid wissen und dir nicht ungewollt in den Weg kommen."
  },
  "Projector": {
    label: "Warten auf Einladung",
    text: "Warte, bis du eingeladen wirst, bevor du deine Energie oder deinen Rat gibst, vor allem bei den großen Themen wie Beziehung, Arbeit, Wohnort. Ohne Einladung wird deine Energie oft nicht angenommen, egal wie richtig sie ist."
  },
  "Reflector": {
    label: "Einen Mondzyklus abwarten",
    text: "Warte einen kompletten Mondzyklus, bevor du große Entscheidungen triffst. Was sich nach 28 Tagen noch stimmig anfühlt, ist deine Wahrheit."
  }
};

const AUTHORITY_TEXTS = {
  Emotional: {
    label: "Emotionale Autorität",
    text: "Deine Klarheit kommt über Zeit, nicht im Moment. Schlaf mindestens eine Nacht drüber, bei wichtigen Themen lieber mehrere, bevor du entscheidest. Im Hoch fühlt sich alles wie eine gute Idee an, im Tief wie eine Katastrophe... die Wahrheit liegt meistens in der Welle dazwischen."
  },
  Sacral: {
    label: "Sakrale Autorität",
    text: "Dein Bauch antwortet sofort, mit einem hörbaren Ja oder Nein direkt im Körper. Kopf-Gedanken kommen meistens später und verwässern das nur. Vertrau dem ersten Laut, nicht der Erklärung danach."
  },
  Splenic: {
    label: "Milz-Autorität",
    text: "Deine Intuition spricht leise, im Jetzt, und meistens nur einmal. Kein Grübeln, kein Zurückspulen, keine Zweitmeinung. Wenn du es verpasst, weil du zu lange gewartet hast, ist das kein Drama, aber ein Muster, das du kennen darfst."
  },
  Ego: {
    label: "Ego-Autorität",
    text: "Du entscheidest über das, wofür du wirklich Willenskraft aufbringen willst. Sag nur zu, wenn du es auch mit ganzem Einsatz durchziehen willst, nicht aus Pflichtgefühl. Dein Wort ist bindender, als anderen bewusst ist."
  },
  SelfProjected: {
    label: "Selbst-projizierte Autorität",
    text: "Du brauchst deine eigene Stimme, um deine Klarheit zu hören. Sprich es aus, laut, am besten mit jemandem, der einfach zuhört, ohne zu bewerten. Du merkst selbst am Klang deiner Worte, ob es stimmt."
  },
  Mental: {
    label: "Mentale Autorität",
    text: "Deine Klarheit entsteht im Gespräch und im richtigen Umfeld, nicht im Bauch und nicht über Nacht. Gib dir Zeit, hol dir mehrere Perspektiven, und triff die Entscheidung nie allein im eigenen Kopf."
  },
  Lunar: {
    label: "Lunare Autorität",
    text: "Dein Entscheidungsrhythmus ist der Mondzyklus, rund 28 Tage. Große Entscheidungen darfst du eine komplette Runde lang wirken lassen, bevor du sie triffst."
  }
};

const LINE_TEXTS = {
  1: "die Forscherin: du brauchst ein sicheres Fundament und gehst gern in die Tiefe, bevor du dich zeigst",
  2: "die Natürliche: deine Gabe zeigt sich am liebsten ungefragt, aus dem Rückzug heraus, bis andere dich rausrufen",
  3: "die Entdeckerin: du lernst durch Ausprobieren, auch durch Umwege und das, was andere 'Fehler' nennen",
  4: "die Netzwerkerin: du wirkst über persönliche Beziehungen, dein Kreis trägt dich",
  5: "die Projektionsfläche: andere sehen in dir eine Lösung, bevor sie dich wirklich kennen",
  6: "die Vorbildliche: du brauchst Zeit und Distanz, um Vertrauen zu verdienen, und wächst mit den Jahren zum Leuchtturm"
};

function profileText(personalityLine, designLine) {
  const p = LINE_TEXTS[personalityLine] || "";
  const d = LINE_TEXTS[designLine] || "";
  return `Bewusst bist du ${p}. Unbewusst trägst du ${d}. Beides gehört zu dir, auch wenn es sich manchmal widersprüchlich anfühlt.`;
}

const BODYGRAPH_EXPLAINER = "Ausgefüllte Zentren sind fest definierte Energie in dir, verlässlich und immer verfügbar. Offene, weiße Zentren sind kein Mangel, sondern deine Antennen: hier bist du empfänglich für die Energie anderer Menschen und deiner Umgebung.";
