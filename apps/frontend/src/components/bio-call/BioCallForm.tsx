"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  MapPin,
  FileBadge,
  Users,
  Scale,
  Save,
  Sparkles,
  FileDown,
  Eraser,
  type LucideIcon,
} from "lucide-react";
import { BIO_CALL_SECTIONS, type BioCallSectionId, validateBioCallSave, getFieldLabel, normalizeBioCallPayload } from "@biocall/shared";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionPanel } from "@/components/ui/SectionPanel";
import { GlassButton } from "@/components/glass/GlassButton";
import { Tooltip } from "@/components/ui/Tooltip";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import {
  applyServerFieldErrors,
  scrollToFirstFieldError,
  validationSummaryMessage,
  hasMeaningfulFormInput,
} from "@/lib/formErrors";
import { persistBioCallDraft, restoreBioCallDraft, clearBioCallDraft } from "@/lib/formDraft";

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
      segundoNombre: "",
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
      segundoNombreConyuge: "",
      apellidoPaternoConyuge: "",
      apellidoMaternoConyuge: "",
      fechaMatrimonioConyuge: "",
      lugarMatrimonioConyuge: "",
      fechaNacimientoConyuge: "",
      lugarNacimientoConyuge: "",
      nombresPadre: "",
      segundoNombrePadre: "",
      apellidoPaternoPadre: "",
      apellidoMaternoPadre: "",
      nombresMadre: "",
      segundoNombreMadre: "",
      apellidoPaternoMadre: "",
      apellidoMaternoMadre: "",
      casado: "",
      previamenteCasado: "",
      matrimoniosPrevios: [] as Array<{
        nombresExConyuge: string;
        segundoNombreExConyuge: string;
        apellidoPaternoExConyuge: string;
        apellidoMaternoExConyuge: string;
        fechaLugarMatrimonio: string;
        fechaLugarNacimiento: string;
        fechaLugarDivorcio: string;
      }>,
      tieneHijos: "",
      hijos: [] as Array<{
        nombres: string;
        segundoNombre: string;
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
      inadMyUscisDetalle: "",
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

type FormData = ReturnType<typeof createEmptyFormData>;

const YES_NO_SABE = new Set(["si", "no", "no_sabe", ""]);

function splitLegacyNameFields(
  nombres: string,
  segundoNombre: string
): { nombres: string; segundoNombre: string } {
  const trimmed = nombres.trim();
  const segundo = (segundoNombre ?? "").trim();
  if (segundo || !trimmed.includes(" ")) {
    return { nombres: trimmed, segundoNombre: segundo };
  }
  const spaceIdx = trimmed.indexOf(" ");
  return {
    nombres: trimmed.slice(0, spaceIdx).trim(),
    segundoNombre: trimmed.slice(spaceIdx + 1).trim(),
  };
}

function migrateLegacyDraft(merged: FormData): FormData {
  const personalData = {
    ...merged.personalData,
    ...splitLegacyNameFields(merged.personalData.nombres, merged.personalData.segundoNombre),
  };

  const family = { ...merged.family };
  const conyuge = splitLegacyNameFields(family.nombresConyuge, family.segundoNombreConyuge);
  family.nombresConyuge = conyuge.nombres;
  family.segundoNombreConyuge = conyuge.segundoNombre;

  const padre = splitLegacyNameFields(family.nombresPadre, family.segundoNombrePadre);
  family.nombresPadre = padre.nombres;
  family.segundoNombrePadre = padre.segundoNombre;

  const madre = splitLegacyNameFields(family.nombresMadre, family.segundoNombreMadre);
  family.nombresMadre = madre.nombres;
  family.segundoNombreMadre = madre.segundoNombre;

  family.hijos = (family.hijos ?? []).map((hijo) => ({
    ...hijo,
    ...splitLegacyNameFields(hijo.nombres, hijo.segundoNombre),
  }));

  family.matrimoniosPrevios = (family.matrimoniosPrevios ?? []).map((mat) => {
    const names = splitLegacyNameFields(mat.nombresExConyuge, mat.segundoNombreExConyuge);
    return { ...mat, nombresExConyuge: names.nombres, segundoNombreExConyuge: names.segundoNombre };
  });

  const caseBackground = { ...merged.caseBackground };
  if (
    typeof caseBackground.inadMyUscis === "string" &&
    !YES_NO_SABE.has(caseBackground.inadMyUscis.trim())
  ) {
    caseBackground.inadMyUscisDetalle = caseBackground.inadMyUscis.trim();
    caseBackground.inadMyUscis = "si";
  }
  if (caseBackground.inadMyUscisDetalle === undefined) {
    caseBackground.inadMyUscisDetalle = "";
  }

  return { ...merged, personalData, family, caseBackground };
}

function mergeDraftIntoForm(parsed: Record<string, unknown>): FormData {
  const base = createEmptyFormData();
  const merged: Record<string, unknown> = { ...base };

  for (const key of Object.keys(base)) {
    const section = parsed[key];
    if (section && typeof section === "object" && !Array.isArray(section)) {
      merged[key] = {
        ...((base as Record<string, unknown>)[key] as object),
        ...(section as object),
      };
    } else if (section !== undefined) {
      merged[key] = section;
    }
  }

  const pd = parsed.personalData;
  if (pd && typeof pd === "object" && !Array.isArray(pd)) {
    const legacy = pd as Record<string, unknown>;
    const personalData = merged.personalData as FormData["personalData"];
    if (
      typeof legacy.lugarNacimiento === "string" &&
      legacy.lugarNacimiento.trim() &&
      !personalData.ciudadNacimiento &&
      !personalData.estadoNacimiento &&
      !personalData.paisNacimiento
    ) {
      merged.personalData = {
        ...personalData,
        ciudadNacimiento: legacy.lugarNacimiento,
      };
    }
  }

  return migrateLegacyDraft(merged as FormData);
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

export function BioCallForm() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const [savedBioCallId, setSavedBioCallId] = useState<string | null>(null);
  /** Snapshot del formulario al ultimo guardado exitoso (para habilitar PDF solo si no hubo cambios). */
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(createEmptyFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const skipDraftPersistRef = useRef(true);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Restaurar borrador tras el primer render (evita mismatch SSR y carrera con persistencia).
  useEffect(() => {
    const { data, recovered } = restoreBioCallDraft(createEmptyFormData, mergeDraftIntoForm);
    setFormData(data);
    if (recovered) {
      toast.success("Borrador recuperado automáticamente", { id: "biocall-draft-recovered" });
    }
  }, []);

  // Persistir borrador al editar; la primera ejecucion se omite (formData aun no hidratado).
  useEffect(() => {
    if (skipDraftPersistRef.current) {
      skipDraftPersistRef.current = false;
      return;
    }

    persistBioCallDraft(formData);
    if (!hasMeaningfulFormInput(formData)) {
      setSavedBioCallId(null);
      setLastSavedSnapshot(null);
    }
  }, [formData]);

  // Respaldo al cerrar o recargar: guarda el estado mas reciente si hay datos reales.
  useEffect(() => {
    const onPageHide = () => {
      persistBioCallDraft(formDataRef.current);
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  const formSnapshot = stableStringify(formData);
  const canSave = hasMeaningfulFormInput(formData);
  const canDownloadPdf =
    savedBioCallId !== null && lastSavedSnapshot === formSnapshot;

  const updateSection = <K extends keyof FormData>(
    section: K,
    fields: Partial<FormData[K]>
  ) => {
    const sectionKey = String(section);
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(fields)) {
        delete next[`${sectionKey}.${key}`];
        const prefix = `${sectionKey}.${key}.`;
        for (const path of Object.keys(next)) {
          if (path.startsWith(prefix)) delete next[path];
        }
      }
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...fields,
      },
    }));
  };

  const showValidationErrors = (errorMap: Record<string, string>) => {
    const count = Object.keys(errorMap).length;
    if (count === 0) return;
    setFieldErrors(errorMap);
    toast.error(validationSummaryMessage(count));
    scrollToFirstFieldError(errorMap);
  };

  // Acción para guardar el formulario
  const handleSave = async () => {
    if (!canSave) {
      toast.error("Completa al menos un campo antes de guardar.");
      return;
    }

    const normalized = normalizeBioCallPayload(formData) as FormData;
    const validation = validateBioCallSave(normalized);
    if (!validation.ok) {
      showValidationErrors(validation.errorMap);
      return;
    }

    setFieldErrors({});
    const loadingToast = toast.loading("Guardando datos en el servidor...");
    try {
      const response = await fetch(`${API_BASE}/api/bio-calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...normalized,
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
        setFieldErrors({});
        console.log("Bio Call guardada:", resData);
      } else {
        toast.dismiss(loadingToast);
        const serverMap =
          (resData.errorMap as Record<string, string> | undefined) ??
          applyServerFieldErrors(resData.fieldErrors);
        if (serverMap && Object.keys(serverMap).length > 0) {
          showValidationErrors(serverMap);
        } else {
          toast.error(resData.error || "No se pudo guardar la Bio Call.");
        }
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

  const handleClearForm = () => {
    if (!hasMeaningfulFormInput(formData)) {
      clearBioCallDraft();
      toast("El formulario ya está vacío.");
      return;
    }

    const confirmed = window.confirm(
      "¿Borrar todos los datos del formulario y el borrador guardado en este navegador? No se puede deshacer."
    );
    if (!confirmed) return;

    clearBioCallDraft();
    setFormData(createEmptyFormData());
    setFieldErrors({});
    setSavedBioCallId(null);
    setLastSavedSnapshot(null);
    toast.success("Formulario vacío. Puedes iniciar una nueva Bio Call.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSectionContent = (sectionId: BioCallSectionId) => {
    switch (sectionId) {
      case "datos-personales":
        return (
          <PersonalDataSection
            data={formData.personalData}
            errors={fieldErrors}
            onChange={(fields) => updateSection("personalData", fields)}
          />
        );
      case "contacto":
        return (
          <ContactSection
            data={formData.contact}
            errors={fieldErrors}
            onChange={(fields) => updateSection("contact", fields)}
          />
        );
      case "domicilio":
        return (
          <AddressSection
            data={formData.address}
            errors={fieldErrors}
            onChange={(fields) => updateSection("address", fields)}
          />
        );
      case "documentos":
        return (
          <DocumentsSection
            data={formData.documents}
            errors={fieldErrors}
            onChange={(fields) => updateSection("documents", fields)}
          />
        );
      case "familia":
        return (
          <FamilySection
            data={formData.family}
            errors={fieldErrors}
            onChange={(fields) => updateSection("family", fields)}
          />
        );
      case "caso":
        return (
          <CaseSection
            data={formData.caseBackground}
            errors={fieldErrors}
            onChange={(fields) => updateSection("caseBackground", fields)}
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
            <Tooltip
              content={
                canSave
                  ? "Borrar todos los campos y el borrador guardado"
                  : "El formulario ya está vacío"
              }
            >
              <span>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  leftIcon={<Eraser className="h-4 w-4" aria-hidden="true" />}
                  disabled={!canSave}
                  onClick={handleClearForm}
                >
                  Limpiar formulario
                </GlassButton>
              </span>
            </Tooltip>
            <Tooltip content={canSave ? "Guardar información de la Bio Call" : "Completa al menos un campo para guardar"}>
              <span>
                <GlassButton
                  variant={canSave ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
                  aria-disabled={!canSave}
                  className={cn(
                    !canSave &&
                      "opacity-50 text-brand-400 border-brand-100/40 shadow-none hover:bg-white/85 hover:text-brand-400 hover:shadow-none active:scale-100 cursor-pointer"
                  )}
                  onClick={handleSave}
                >
                  Guardar Bio Call
                </GlassButton>
              </span>
            </Tooltip>
          </div>
        </header>

        {Object.keys(fieldErrors).length > 0 && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            <p className="font-semibold">{validationSummaryMessage(Object.keys(fieldErrors).length)}</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {Object.entries(fieldErrors)
                .slice(0, 5)
                .map(([path, message]) => (
                  <li key={path}>
                    <span className="font-medium">{getFieldLabel(path)}</span>: {message}
                  </li>
                ))}
              {Object.keys(fieldErrors).length > 5 && (
                <li>...y {Object.keys(fieldErrors).length - 5} mas</li>
              )}
            </ul>
          </div>
        )}

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


