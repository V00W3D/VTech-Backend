// src/seed.ts
import { config } from "dotenv";
config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { UsersModel } from "@models/Users";
import { ServiceTypesModel } from "@models/ServiceTypes";
import { RequestsModel } from "@models/Requests";

const MONGO_URI = process.env.MONGO_URI!;

(async () => {
  try {
    console.log("🌱 Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Limpiando colecciones previas...");
    await Promise.all([
      UsersModel.deleteMany({}),
      ServiceTypesModel.deleteMany({}),
      RequestsModel.deleteMany({}),
    ]);

    // ==========================
    // 👤 Usuarios base
    // ==========================
    const [admin, cliente1, cliente2] = await UsersModel.create([
      {
        name: "Navarro Victor Leandro",
        email: "v00w3d@gmail.com",
        phone: "5493815559420",
        password: await bcrypt.hash("123456", 10),
        role: "Admin",
      },
      {
        name: "Juan Pérez",
        email: "juan@c.com",
        phone: "111222333",
        password: await bcrypt.hash("123456", 10),
        role: "Cliente",
      },
      {
        name: "María López",
        email: "maria@c.com",
        phone: "999888777",
        password: await bcrypt.hash("123456", 10),
        role: "Cliente",
      },
    ]);

    // ==========================
    // 🎯 Targets embebidos por servicio
    // ==========================
    const TARGETS = {
      PC: {
        name: "PC",
        description: "Computadora de escritorio",
        icon: "/icons/PC.png",
      },
      NOTEBOOK: {
        name: "Notebook",
        description: "Portátiles y laptops",
        icon: "/icons/laptop.png",
      },
      TELEFONO: {
        name: "Teléfono",
        description: "Celulares y smartphones",
        icon: "/icons/telefono.png",
      },
      CONSOLA: {
        name: "Consola",
        description: "PS4, PS5, Xbox, Nintendo Switch, etc.",
        icon: "/icons/consola.png",
      },
    };

    // ==========================
    // 🧩 Tipos de servicio con targets embebidos
    // ==========================
    let [limpieza, reparacion, instalacionSO] = await ServiceTypesModel.create([
      {
        name: "Limpieza",
        slogan: "Tu equipo como nuevo, sin sobrecalentamientos",
        shortDescription:
          "Eliminamos polvo, grasa y residuos que afectan el rendimiento.",
        longDescription: `
            La limpieza profunda de tus dispositivos no solo mejora el rendimiento,
            sino que prolonga su vida útil. Desarmamos tu equipo, retiramos el polvo,
            renovamos la pasta térmica y lo dejamos funcionando como recién comprado.
          `,
        image: "/limpieza.webp",
        targets: [TARGETS.PC, TARGETS.NOTEBOOK, TARGETS.TELEFONO],
      },
      {
        name: "Reparación",
        slogan: "Diagnóstico y reparación profesional de cualquier equipo",
        shortDescription:
          "Solucionamos fallas de hardware o software en cualquier dispositivo.",
        longDescription: `
            Nuestros técnicos especializados reparan desde simples fallas eléctricas
            hasta reemplazos complejos de componentes. Sea un PC, notebook, consola o teléfono,
            te ayudamos a recuperar su funcionamiento al 100%.
          `,
        image: "/reparacion.jpg",
        targets: [
          TARGETS.PC,
          TARGETS.NOTEBOOK,
          TARGETS.CONSOLA,
          TARGETS.TELEFONO,
        ],
      },
      {
        name: "Instalación de Sistemas Operativos",
        slogan: "Tu sistema funcionando en minutos",
        shortDescription:
          "Instalamos Windows, Linux o macOS según tus necesidades.",
        longDescription: `
            Instalación completa con drivers, programas esenciales y optimización.
          `,
        image: "/instalacionos.jpg",
        targets: [TARGETS.PC, TARGETS.NOTEBOOK],
      },
    ]);

    // ==========================
    // 📌 Necesito IDs reales de targets embebidos
    // ==========================
    await limpieza.populate("targets");
    await reparacion.populate("targets");
    await instalacionSO.populate("targets");

    const getTargetId = (service: any, targetName: any) =>
      service.targets.find((t: any) => t.name === targetName)._id;

    // ==========================
    // 📦 Requests de ejemplo
    // ==========================
    await RequestsModel.create([
      {
        userId: cliente1._id,
        services: [
          {
            typeId: limpieza._id,
            targetId: getTargetId(limpieza, "PC"),
            description: "Mi PC se sobrecalienta y hace mucho ruido.",
          },
        ],
        status: "pendiente",
      },
      {
        userId: cliente1._id,
        services: [
          {
            typeId: instalacionSO._id,
            targetId: getTargetId(instalacionSO, "Notebook"),
            description: "Quiero reinstalar Windows 11 desde cero.",
          },
        ],
        status: "aceptada",
      },
      {
        userId: cliente2._id,
        services: [
          {
            typeId: reparacion._id,
            targetId: getTargetId(reparacion, "Teléfono"),
            description: "El micrófono de mi celular no funciona.",
          },
          {
            typeId: limpieza._id,
            targetId: getTargetId(limpieza, "Teléfono"),
            description: "También quiero que limpien el interior del teléfono.",
          },
        ],
        status: "pendiente",
      },
      {
        userId: cliente2._id,
        services: [
          {
            typeId: reparacion._id,
            targetId: getTargetId(reparacion, "Consola"),
            description: "Mi PS5 no enciende después de un corte de luz.",
          },
        ],
        status: "rechazada",
      },
      {
        userId: cliente1._id,
        services: [
          {
            typeId: reparacion._id,
            targetId: getTargetId(reparacion, "PC"),
            description: "La PC no da video, posiblemente la placa de video.",
          },
          {
            typeId: limpieza._id,
            targetId: getTargetId(limpieza, "PC"),
            description: "Aprovecho para pedir limpieza general.",
          },
        ],
        status: "finalizada",
      },
    ]);

    console.log("✅ Seed completado con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar seed:", error);
    process.exit(1);
  }
})();
