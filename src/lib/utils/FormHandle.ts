// @ts-nocheck
import { markdownify } from "./textConverter";

export function formReset(form: HTMLFormElement) {
  form?.reset();

  const validationTags = form?.querySelectorAll(
    "[input-wrapper]:not(.hidden):not(.message)",
  );

  validationTags?.forEach((tag) => {
    tag.classList.remove("is-filled", "is-success", "is-error");
  });

  const selectTags = form?.querySelectorAll(
    "[input-wrapper]:not(.hidden) select[data-hs-select]",
  );

  selectTags?.forEach((tag) => {
    const selectElement = tag as HTMLSelectElement;
    const hsSelectApi =
      typeof window !== "undefined" ? (window as any).HSSelect : undefined;
    const select =
      hsSelectApi && typeof hsSelectApi.getInstance === "function"
        ? hsSelectApi.getInstance(tag)
        : null;
    selectElement.selectedIndex = 0;

    if (select && typeof select.setValue === "function") {
      select.setValue("");
    }
  });
}

export const validateSelectTag = (tag: HTMLSelectElement) => {
  const validationTag = tag.closest("[input-wrapper]");

  if (tag.value === "") {
    validationTag?.classList.remove("is-filled", "is-success", "is-error");
  } else {
    validationTag?.classList.add("is-filled");
    validationTag?.classList.remove("is-error", "is-success");
  }
};

export function isFormFilled(form: HTMLFormElement): boolean {
  const elements = form.querySelectorAll(
    "input[name], [input-wrapper]:not(.hidden) select[data-hs-select], textarea[name]",
  );
  type element = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  for (let element of elements) {
    const elem = element as element;

    if (elem.tagName === "SELECT" && elem.value === "") {
      return false;
    } else if (elem.hasAttribute("required") && elem.value === "") {
      return false;
    }
  }
  return true;
}

export const setMessage = (
  message: string,
  status: boolean | "pending",
  disableSubmit = false,
  form: HTMLFormElement,
) => {
  const submitButton = form?.querySelector('button[type="submit"]');
  const messageType =
    status === "pending" ? "pending" : status ? "success" : "error";
  const allMessages = form.querySelectorAll(".message");
  const messageElement = form.querySelector(`.message.${messageType}`);
  const msgEleText =
    messageElement?.querySelector<HTMLElement>(
      ".contact-form-message-content",
    ) ||
    messageElement?.querySelector<HTMLElement>(".prose-styles") ||
    (messageElement as HTMLElement | null);
  const default_message = msgEleText?.getAttribute("data-default");

  allMessages.forEach((msg) => {
    if (msg !== messageElement) {
      msg.classList.add("hidden");
    }
  });

  if (message === "default" && msgEleText && default_message) {
    msgEleText.innerHTML = markdownify(default_message, true) as string;
  }

  messageElement?.classList.remove("hidden");

  if (disableSubmit) {
    submitButton?.setAttribute("disabled", "true");
  } else {
    submitButton?.removeAttribute("disabled");
  }

  if (msgEleText && message !== "default") {
    msgEleText.innerHTML = markdownify(message, true) as string;
  }
};

export const formSubmit = async ({
  form,
  action,
}: {
  form: HTMLFormElement;
  action: string;
}) => {
  const data = Object.fromEntries(new FormData(form).entries());
  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = 60000;

  const ajaxAction = action.replace("formsubmit.co/", "formsubmit.co/ajax/");

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(ajaxAction, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      signal,
    });

    let jsonResponse: Record<string, any> = {};

    try {
      jsonResponse = await response.json();
    } catch {
      jsonResponse = {};
    }

    const wasSuccessful =
      response.ok &&
      jsonResponse.success !== false &&
      jsonResponse.success !== "false";

    if (wasSuccessful) {
      setMessage("default", true, false, form);
      formReset(form);
      return;
    }

    setMessage(jsonResponse.message, false, false, form);
  } catch (error: any) {
    console.log(error);
    if (error?.name === "AbortError") {
      setMessage(
        "We couldn't reach the server. Trying alternative server.",
        false,
        false,
        form,
      );
    } else {
      setMessage(
        "Oops! There was a problem submitting your form.",
        false,
        false,
        form,
      );
    }
  } finally {
    clearTimeout(timer);
  }
};

export const fetchWithTimeout = async (
  url: string,
  data: Record<string, FormDataEntryValue>,
  controller: AbortController,
  timeout: number,
) => {
  setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    signal: controller.signal,
  });

  if (response.status !== 200) {
    throw new Error("Request failed with status code " + response.status);
  }
};

export const formspreeSubmit = async (
  data: Record<string, FormDataEntryValue>,
  timeout: number,
  form: HTMLFormElement,
) => {
  try {
    await fetchWithTimeout(
      "https://formspree.io/f/xwpkvjaa",
      data,
      new AbortController(),
      timeout,
    );
    setMessage("default", true, false, form);
    formReset(form);
  } catch (error) {
    setMessage(
      error +
        "! Please use this mail - [jinlimei@kingsendainsulation.com](mailto:jinlimei@kingsendainsulation.com) to submit a ticket!",
      false,
      false,
      form,
    );
  }
};

export const netlifySubmit = async (form: HTMLFormElement, action: string) => {
  const data = new URLSearchParams(new FormData(form) as any).toString();
  try {
    const response = await fetch(action, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });
    if (response.ok) {
      setMessage("default", true, false, form);
      formReset(form);
    } else {
      throw new Error("Netlify form submission failed.");
    }
  } catch (error) {
    setMessage("Netlify submission error: " + error, false, false, form);
    throw error;
  }
};
