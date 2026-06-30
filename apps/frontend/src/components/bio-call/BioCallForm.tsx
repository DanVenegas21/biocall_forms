"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  FileBadge,
  Users,
  Scale,
  Save,
  Sparkles,
  Hammer,
  FileDown,
  type LucideIcon,
} from "lucide-react";
import { BIO_CALL_SECTIONS, type BioCallSectionId } from "@biocall/shared";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassButton } from "@/components/glass/GlassButton";
import { Tooltip } from "@/components/ui/Tooltip";
import toast from "react-hot-toast";

// Importación de componentes de sección
import { PersonalDataSection } from "./sections/PersonalDataSection";
import { ContactSection } from "./sections/ContactSection";
import { AddressSection } from "./sections/AddressSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { FamilySection } from "./sections/FamilySection";
import { CaseSection } from "./sections/CaseSection";

/** Icono asociado a cada seccion (la metadata vive en @biocall/shared). */
const SECTION_ICONS: Record<BioCallSectionId, LucideIcon> = {
  "datos-personales": User,
  contacto: Phone,
  domicilio: MapPin,
  documentos: FileBadge,
  familia: Users,
  caso: Scale,
};

function createEmptyFormData() {
  return {
    personalData: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      ciudadNacimiento: "",
      estadoNacimiento: "",
      paisNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidad: "",
      comprendeIngles: "",
      idiomaPreferido: "",
      hablaOtroIdioma: "",
      especificarIdioma: "",
      otrosNombres: "",
    },
    contact: {
      telefono: "",
      correoElectronico: "",
    },
    address: {
      calleNumero: "",
      aptoSuite: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      pais: "",
      fechaIngreso: "",
      resididoOtrosLugares: "",
      direccionesAnteriores: [] as Array<{
        calleNumero: string;
        aptoSuite: string;
        ciudad: string;
        estado: string;
        codigoPostal: string;
        pais: string;
        fechaDesde: string;
        fechaHasta: string;
      }>,
    },
    documents: {
      tienePasaporte: "",
      pasaportePendiente: "",
      numeroPasaporte: "",
      paisEmision: "",
      fechaEmision: "",
      fechaExpiracion: "",
      tieneANumber: "",
      aNumberValue: "",
      aNumberOrigen: "",
      tieneSSN: "",
      ssnValue: "",
      tieneEAD: "",
      eadValue: "",
    },
    family: {
      tieneConyuge: "",
      nombresConyuge: "",
      apellidoPaternoConyuge: "",
      apellidoMaternoConyuge: "",
      fechaLugarMatrimonioConyuge: "",
      fechaLugarNacimientoConyuge: "",
      nombresPadre: "",
      apellidoPaternoPadre: "",
      apellidoMaternoPadre: "",
      nombresMadre: "",
      apellidoPaternoMadre: "",
      apellidoMaternoMadre: "",
      casado: "",
      previamenteCasado: "",
      matrimoniosPrevios: [] as Array<{
        nombresExConyuge: string;
        apellidoPaternoExConyuge: string;
        apellidoMaternoExConyuge: string;
        fechaLugarMatrimonio: string;
        fechaLugarNacimiento: string;
        fechaLugarDivorcio: string;
      }>,
      tieneHijos: "",
      hijos: [] as Array<{
        nombres: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        fechaNacimiento: string;
        lugarNacimiento: string;
        lugarResidencia: string;
      }>,
    },
    caseBackground: {
      viajes: [] as Array<{
        fechaEntrada: string;
        formaEntrada: string;
        lugarEntrada: string;
        fechaSalida: string;
        fueDetenido: string;
        detallesDetencion: string;
      }>,
      viajesComentarios: "",
      detenidoInmigracion: "",
      detencionesInmi: [] as Array<{
        lugar: string;
        fecha: string;
        autoridad: string;
        ordenDeportacion: string;
        sancionCastigo: string;
        regresoVoluntario: string;
        fotosHuellas: string;
        citaCorte: string;
      }>,
      arrestadoPolicia: "",
      arrestosPolicia: [] as Array<{
        paisCiudadEstado: string;
        fecha: string;
        motivo: string;
        autoridad: string;
        disposicion: string;
      }>,
      empleoNombre: "",
      empleoOcupacion: "",
      empleoDireccionCalle: "",
      empleoDireccionApto: "",
      empleoDireccionCiudad: "",
      empleoDireccionEstado: "",
      empleoDireccionZip: "",
      empleoDireccionPais: "",
      empleoFechaIngreso: "",
      empleoFechaSalida: "",
      empleoOtrosLugares: "",
      empleosAnteriores: [] as Array<{
        empresa: string;
        puesto: string;
        direccionCalle: string;
        direccionApto: string;
        direccionCiudad: string;
        direccionEstado: string;
        direccionZip: string;
        direccionPais: string;
        fechaDesde: string;
        fechaHasta: string;
      }>,
      inadDetencionTrafico: "no",
      inadCometidoDelito: "no",
      inadInmunidadDiplomatica: "no",
      inadProstitucionTrafico: "no",
      inadAyudaIngresoIlegal: "no",
      inadTerrorismo: "no",
      inadFondosTerrorismo: "no",
      inadAsociacionTerrorista: "no",
      inadEspionaje: "no",
      inadPartidoComunista: "no",
      inadParticipadoPersecucion: "no",
      inadProcedimientoRemocion: "no",
      inadDenegadoVisa: "no",
      inadVisaT: "no",
      inadMyUscis: "no",
      inadGrupoMilitar: "no",
      inadFraudeMigratorio: "no",
      inadTrastornoFisicoMental: "no",
      inadEnfermedadPublica: "no",
      inadAdictoDrogas: "no",
      declaradoCiudadano: "",
      falsaDeclaracionLugar: "",
      falsaDeclaracionFecha: "",
      falsaDeclaracionComo: "",
      falsaDeclaracionIntencion: "",
      falsaDeclaracionDetalle: "",
      foias: {
        uscis: { solicitar: "no", motivo: "" },
        ice: { solicitar: "no", motivo: "" },
        cbp: { solicitar: "no", motivo: "" },
        eoir: { solicitar: "no", motivo: "" },
        fbi: { solicitar: "no", motivo: "" },
        policia: { solicitar: "no", motivo: "" },
      },
      documentosPendientes: "",
      correosPendientes: "",
    },
  };
}

const EMPTY_FORM_DATA = createEmptyFormData();

type FormData = ReturnType<typeof createEmptyFormData>;

function mergeDraftIntoForm(parsed: Record<string, unknown>): FormData {
  const base = createEmptyFormData();
  const merged = { ...base };

  for (const key of Object.keys(base) as Array<keyof FormData>) {
    const section = parsed[key as string];
    if (section && typeof section === "object" && !Array.isArray(section)) {
      Object.assign(merged[key] as object, section as object);
    } else if (section !== undefined) {
      (merged as Record<string, unknown>)[key as string] = section;
    }
  }

  const pd = parsed.personalData;
  if (pd && typeof pd === "object" && !Array.isArray(pd)) {
    const legacy = pd as Record<string, unknown>;
    if (
      typeof legacy.lugarNacimiento === "string" &&
      legacy.lugarNacimiento.trim() &&
      !merged.personalData.ciudadNacimiento &&
      !merged.personalData.estadoNacimiento &&
      !merged.personalData.paisNacimiento
    ) {
      merged.personalData = {
        ...merged.personalData,
        ciudadNacimiento: legacy.lugarNacimiento,
      };
    }
  }

  return merged;
}

/** Serializa el formulario para comparar si hay cambios reales del usuario. */
function stableStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  if (typeof value === "string") {
    return JSON.stringify(value.trim());
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hasUserInput(current: FormData, baseline: FormData = EMPTY_FORM_DATA): boolean {
  return stableStringify(current) !== stableStringify(baseline);
}

export function BioCallForm() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const [savedBioCallId, setSavedBioCallId] = useState<string | null>(null);
  /** Snapshot del formulario al ultimo guardado exitoso (para habilitar PDF solo si no hubo cambios). */
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(createEmptyFormData);
  useEffect(() => {
    const saved = localStorage.getItem("biocall_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        const merged = mergeDraftIntoForm(parsed);

        if (hasUserInput(merged)) {
          setFormData(merged);
          toast.success("Borrador recuperado automáticamente");
        } else {
          localStorage.removeItem("biocall_draft");
        }
      } catch (e) {
        console.error("Error al cargar borrador desde localStorage:", e);
        localStorage.removeItem("biocall_draft");
      }
    }
  }, []);

  // Guardar en localStorage ante cualquier cambio con datos reales del usuario
  useEffect(() => {
    if (hasUserInput(formData)) {
      localStorage.setItem("biocall_draft", JSON.stringify(formData));
    } else {
      localStorage.removeItem("biocall_draft");
      setSavedBioCallId(null);
      setLastSavedSnapshot(null);
    }
  }, [formData]);

  const formSnapshot = stableStringify(formData);
  const canSave = hasUserInput(formData);
  const canDownloadPdf =
    savedBioCallId !== null && lastSavedSnapshot === formSnapshot;

  const updateSection = <K extends keyof FormData>(
    section: K,
    fields: Partial<FormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...fields,
      },
    }));
  };

  // Acción para guardar el formulario
  const handleSave = async () => {
    if (!canSave) {
      toast.error("Completa al menos un campo antes de guardar.");
      return;
    }

    const loadingToast = toast.loading("Guardando datos en el servidor...");
    try {
      const response = await fetch(`${API_BASE}/api/bio-calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(savedBioCallId ? { bioCallId: savedBioCallId } : {}),
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        const newId = resData?.data?.id as string | undefined;
        if (newId) {
          setSavedBioCallId(newId);
          setLastSavedSnapshot(formSnapshot);
        }
        toast.success("Bio Call guardada y PDF generado en el servidor");
        console.log("Bio Call guardada:", resData);
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Error: ${resData.error || "Datos inválidos"}`);
        console.error("Detalles de validación del servidor:", resData.details);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en " +
          API_BASE
      );
      console.error("Error de red al guardar Bio Call:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (!canDownloadPdf || !savedBioCallId) {
      toast.error("Guarda la Bio Call primero para generar el PDF.");
      return;
    }
    window.open(`${API_BASE}/api/bio-calls/${savedBioCallId}/pdf`, "_blank", "noopener,noreferrer");
  };

  const renderSectionContent = (sectionId: BioCallSectionId) => {
    switch (sectionId) {
      case "datos-personales":
        return (
          <PersonalDataSection
            data={formData.personalData}
            onChange={(fields) => updateSection("personalData", fields)}
          />
        );
      case "contacto":
        return (
          <ContactSection
            data={formData.contact}
            onChange={(fields) => updateSection("contact", fields)}
          />
        );
      case "domicilio":
        return (
          <AddressSection
            data={formData.address}
            onChange={(fields) => updateSection("address", fields)}
          />
        );
      case "documentos":
        return (
          <DocumentsSection
            data={formData.documents}
            onChange={(fields) => updateSection("documents", fields)}
          />
        );
      case "familia":
        return (
          <FamilySection
            data={formData.family}
            onChange={(fields) => updateSection("family", fields)}
          />
        );
      case "caso":
        return (
          <CaseSection
            data={formData.caseBackground}
            onChange={(fields) => updateSection("caseBackground", fields)}
          />
        );
      default:
        return (
          <EmptyState
            compact
            icon={<Hammer className="h-7 w-7" aria-hidden="true" />}
            title="Sección pendiente de implementar"
            description="Aquí se colocarán los campos de captura correspondientes para esta sección de la Bio Call."
          />
        );
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Cabecera de pagina */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="page-title">Bio Call del cliente</h1>
            <p className="page-subtitle">
              Captura de información personal para generar el documento de la Bio Call.
            </p>
          </div>

          {/* Barra de acciones */}
          <div className="dashboard-action-bar">
            <Tooltip content="Disponible al implementar autocompletado">
              <span>
                <GlassButton
                  variant="ai"
                  size="sm"
                  leftIcon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                  disabled
                >
                  Autocompletar con IA
                </GlassButton>
              </span>
            </Tooltip>
            <Tooltip
              content={
                canDownloadPdf
                  ? "Descargar PDF de la Bio Call"
                  : savedBioCallId
                    ? "Guarda de nuevo tras editar el formulario"
                    : "Guarda primero para generar el PDF"
              }
            >
              <span>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileDown className="h-4 w-4" aria-hidden="true" />}
                  disabled={!canDownloadPdf}
                  onClick={handleDownloadPdf}
                >
                  Descargar PDF
                </GlassButton>
              </span>
            </Tooltip>
            <Tooltip content={canSave ? "Guardar información de la Bio Call" : "Completa al menos un campo para guardar"}>
              <span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
                  disabled={!canSave}
                  onClick={handleSave}
                >
                  Guardar Bio Call
                </GlassButton>
              </span>
            </Tooltip>
          </div>
        </header>

        {/* Layout principal: indice + secciones */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Indice de secciones */}
          <aside className="lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)] lg:self-start">
            <nav
              aria-label="Secciones de la Bio Call"
              className="solid-panel p-3"
            >
              <p className="label-caps px-2 pb-2">Secciones</p>
              <ul className="space-y-1">
                {BIO_CALL_SECTIONS.map((section) => {
                  const Icon = SECTION_ICONS[section.id];
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="nav-tab w-full justify-start"
                      >
                        <Icon
                          className="h-4 w-4 text-brand-500"
                          aria-hidden="true"
                        />
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Contenido: una seccion por bloque de la Bio Call */}
          <div className="space-y-6">
            {BIO_CALL_SECTIONS.map((section, index) => {
              const Icon = SECTION_ICONS[section.id];
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <SectionPanel
                    title={section.title}
                    description={section.description}
                    icon={<Icon className="h-5 w-5" aria-hidden="true" />}
                    accent={index === 0}
                  >
                    {renderSectionContent(section.id)}
                  </SectionPanel>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}


