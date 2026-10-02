import Swal, { SweetAlertOptions } from 'sweetalert2';

/**
 * SweetAlert Helper dengan styling ramah lansia:
 * Font besar (min 18px), tombol tinggi & lebar (min 52px), kontras warna tinggi.
 */
export const showElderlyAlert = (options: SweetAlertOptions) => {
  return Swal.fire({
    customClass: {
      popup: 'rounded-2xl p-6 shadow-xl border border-slate-200',
      title: 'text-2xl font-bold text-slate-900',
      htmlContainer: 'text-lg text-slate-700 leading-relaxed mt-2',
      confirmButton:
        'bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3.5 rounded-xl shadow-md min-h-[52px]',
      cancelButton:
        'bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-lg px-8 py-3.5 rounded-xl min-h-[52px]',
    },
    buttonsStyling: false,
    ...options,
  });
};

export const showSuccessAlert = (title: string, message: string) => {
  return showElderlyAlert({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'Baik, Mengerti',
  });
};

export const showErrorAlert = (
  title: string = 'Mohon Maaf',
  message: string = 'Terjadi kendala saat memproses data. Silakan coba kembali.'
) => {
  return showElderlyAlert({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Tutup',
  });
};
