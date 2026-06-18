// ===========================
// FUNCIONES DE NAVEGACIÓN
// ===========================

function nextStep(stepNumber) {
    // Validar el paso actual antes de continuar
    const currentStep = stepNumber - 1;
    if (!validateStep(currentStep)) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    // Ocultar paso actual
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    // Mostrar siguiente paso
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Actualizar progreso
    updateProgress(stepNumber);
    
    // Scroll al inicio del formulario
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function prevStep(stepNumber) {
    // Ocultar paso actual
    const currentStep = stepNumber + 1;
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    // Mostrar paso anterior
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Actualizar progreso
    updateProgress(stepNumber);
    
    // Scroll al inicio del formulario
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function updateProgress(stepNumber) {
    // Actualizar círculos de progreso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 < stepNumber) {
            step.classList.add('active');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Actualizar líneas de progreso
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        if (index < stepNumber - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

// ===========================
// VALIDACIÓN DE PASOS
// ===========================

function validateStep(stepNumber) {
    const inputs = document.querySelectorAll(`#step-${stepNumber} input[required], #step-${stepNumber} select[required], #step-${stepNumber} textarea[required]`);
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    // Validación específica para Step 1
    if (stepNumber === 1) {
        const rfc = document.getElementById('rfc').value;
        const email = document.getElementById('email').value;
        
        if (rfc.length < 10) {
            alert('El RFC debe tener al menos 10 caracteres');
            return false;
        }
        
        if (!isValidEmail(email)) {
            alert('Por favor ingresa un correo válido');
            return false;
        }
    }

    // Validación específica para Step 5
    if (stepNumber === 5) {
        const confirmacion = document.getElementById('confirmacion').checked;
        const privacidad = document.getElementById('privacidad').checked;
        
        if (!confirmacion || !privacidad) {
            alert('Debes aceptar los términos y condiciones');
            return false;
        }
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===========================
// CARGA DE ARCHIVOS
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Configurar drag and drop para todos los inputs de archivo
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        const uploadBox = input.closest('.upload-box');
        
        // Drag over
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });
        
        // Drag leave
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('dragover');
        });
        
        // Drop
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            input.files = files;
            updateFilePreview(input);
        });
        
        // Change event
        input.addEventListener('change', () => {
            updateFilePreview(input);
        });
    });

    // Inicializar cálculo de totales
    updateIncomeTotals();
    updateExpenseTotals();

    // Event listeners para inputs de números
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', () => {
            updateIncomeTotals();
            updateExpenseTotals();
            updateReviewSummary();
        });
    });
});

function updateFilePreview(input) {
    const previewContainer = input.parentElement.querySelector('.preview-files');
    previewContainer.innerHTML = '';
    
    if (input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-file';
            removeBtn.textContent = '✕';
            removeBtn.onclick = () => {
                // Crear nuevo FileList sin este archivo
                const newFiles = new DataTransfer();
                Array.from(input.files).forEach((f, i) => {
                    if (i !== index) {
                        newFiles.items.add(f);
                    }
                });
                input.files = newFiles.files;
                updateFilePreview(input);
            };
            
            filePreview.appendChild(fileName);
            filePreview.appendChild(removeBtn);
            previewContainer.appendChild(filePreview);
        });
    }
}

// ===========================
// CÁLCULOS DE TOTALES
// ===========================

function updateIncomeTotals() {
    const salario = parseFloat(document.getElementById('ingreso-salario').value) || 0;
    const freelance = parseFloat(document.getElementById('ingreso-freelance').value) || 0;
    const inversiones = parseFloat(document.getElementById('ingreso-inversiones').value) || 0;
    const alquileres = parseFloat(document.getElementById('ingreso-alquileres').value) || 0;
    const otros = parseFloat(document.getElementById('ingreso-otros').value) || 0;
    
    const total = salario + freelance + inversiones + alquileres + otros;
    
    document.getElementById('total-ingresos').textContent = formatCurrency(total);
    document.getElementById('review-ingresos').textContent = formatCurrency(total);
}

function updateExpenseTotals() {
    const medico = parseFloat(document.getElementById('gasto-medico').value) || 0;
    const seguros = parseFloat(document.getElementById('gasto-seguros').value) || 0;
    const educacion = parseFloat(document.getElementById('gasto-educacion').value) || 0;
    const cursos = parseFloat(document.getElementById('gasto-cursos').value) || 0;
    const oficina = parseFloat(document.getElementById('gasto-oficina').value) || 0;
    const suministros = parseFloat(document.getElementById('gasto-suministros').value) || 0;
    const utilidades = parseFloat(document.getElementById('gasto-utilidades').value) || 0;
    const transporte = parseFloat(document.getElementById('gasto-transporte').value) || 0;
    const donaciones = parseFloat(document.getElementById('gasto-donaciones').value) || 0;
    const otros = parseFloat(document.getElementById('gasto-otros').value) || 0;
    
    const total = medico + seguros + educacion + cursos + oficina + suministros + utilidades + transporte + donaciones + otros;
    
    document.getElementById('total-gastos').textContent = formatCurrency(total);
    document.getElementById('review-gastos').textContent = formatCurrency(total);
}

function updateReviewSummary() {
    const ingresos = parseFloat(document.getElementById('total-ingresos').textContent.replace(/[$,]/g, '')) || 0;
    const gastos = parseFloat(document.getElementById('total-gastos').textContent.replace(/[$,]/g, '')) || 0;
    const base = ingresos - gastos;
    
    document.getElementById('review-base').textContent = formatCurrency(Math.max(0, base));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

// ===========================
// ENVÍO DE FORMULARIO
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#step-5 form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica para enviar los datos
            console.log('Formulario enviado');
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
        });
    }
});

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success alert-dismissible fade show';
    message.setAttribute('role', 'alert');
    message.innerHTML = `
        <h4 class="alert-heading">¡Declaración Enviada!</h4>
        <p>Tu declaración fiscal ha sido enviada exitosamente. Recibirás una confirmación en tu correo electrónico.</p>
        <hr>
        <p class="mb-0">Tu número de trámite es: <strong>DEC-2024-${Math.random().toString().substr(2, 8)}</strong></p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('.form-container').prepend(message);
    
    // Scroll al mensaje
    message.scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// EVENTOS Y UTILIDADES
// ===========================

// Permitir navegación con Enter en inputs (excepto textarea)
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const nextBtn = document.querySelector('.form-actions .btn-primary-custom');
        if (nextBtn) {
            nextBtn.click();
        }
    }
});

// Guardar datos en localStorage para recuperación
function saveFormData() {
    const formData = new FormData(document.querySelector('.step-form'));
    const data = Object.fromEntries(formData);
    localStorage.setItem('declaracion_form', JSON.stringify(data));
}

function loadFormData() {
    const saved = localStorage.getItem('declaracion_form');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

// Auto-guardar cada 30 segundos
setInterval(saveFormData, 30000);

// Advertencia al salir sin enviar
window.addEventListener('beforeunload', function(e) {
    const hasData = document.querySelector('.form-step.active input:not([type="hidden"])').value.trim() !== '';
    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
    }
});
