/*
1. Afficher / masquer le mot de passe
2. Memorisation de l'email si remember me est coche
3. validation du formulaire de connexion
4. soummission simulee et affichage de l'ecran de succes
5. navigation entre les etapes
6. Mise a jour de l'indicateur de progression
7. ajout de la photo
8. Gestion dynamique de la liste "Education"
9. Champ de OTP
10. Validation simple + ecran de confirmation finale
*/

document.addEventListener('DOMContentLoaded', ()=>{
      if(document.getElementById("signinForm")){
            initPasswordToggle();
            initRememberMe();
            initFormValidationAndSubmit();
      }

      if(document.getElementById("signupForm")){
            const state = {
                  currentStep: 1, // etape actuellement affiche
                  totalSteps: 3,
                  educationList: [], // tableau des diplomes
                  editingId: null, // l'id en cours d'edition
            };
            initStepNavigation(state);
            initPhotoUpload();
            initEducationManager(state);
            initOtpInputs();
            initFormSubmit(state);
            addEducationEntry(state, {
                  degree: "Bachelor's Degree",
                  college: "Universite de Douala",
                  year: "1997-06-01",
            });
      }
});

// Tache 1
function initPasswordToggle(){
      const toggleBtn = document.getElementById('togglePassword');
      const passwordInput = document.getElementById('password');
      if(!toggleBtn || !passwordInput) return;

      const eyeIcon = toggleBtn.querySelector('.icon-eye');
      const eyeOffIcon = toggleBtn.querySelector('.icon-eye-off');

      toggleBtn.addEventListener("click", ()=>{
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.setAttribute('aria-pressed', String(isPassword));
            toggleBtn.setAttribute('aria-label', isPassword ? "Masquer le mot de passe" : "afficher le mot de passe");
            eyeIcon.hidden = isPassword;
            eyeOffIcon.hidden = !isPassword;
      });
}

// tache 2
function initRememberMe(){
      const emailInput = document.getElementById('email');
      const rememberCheckbox = document.getElementById('remember');
      if(!emailInput || !rememberCheckbox) return;

      const savedEmail = localStorage.getItem('signin_remembered_email');
      if(savedEmail){
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
      }
}

//tache 3
function initFormValidationAndSubmit(){
      const form = document.getElementById('signinForm');
      const submitBtn = document.getElementById('submitBtn');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const rememberCheckbox = document.getElementById('remember');
      const successPanel = document.getElementById('signinSuccess');

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.addEventListener('submit', (event)=>{
            event.preventDefault();
            if(!validateSigninForm()) return;

            if(rememberCheckbox.checked){
                  localStorage.setItem('signin_remembered_email', emailInput.value.trim());
            } else {
                  localStorage.removeItem('signin_remembered_email');
            }

            simulateSignIn();
      });

      function validateSigninForm(){
            let isValid = true;
            const emailError = form.querySelector('[data-error-for="email"]');
            if(!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())){
                  isValid = false;
                  emailInput.classList.add('has-error');
                  emailError.textContent = "Merci de saisir une adresse email valide.";
            } else {
                  emailInput.classList.remove('has-error');
                  emailError.textContent = "";
            }
            return isValid;
      }

      function simulateSignIn(){
            const label = submitBtn.querySelector('.btn__label');
            const spinner = submitBtn.querySelector('.btn__spinner');
            submitBtn.disabled = true;
            label.textContent = "Signing in...";
            spinner.hidden = false;

            setTimeout(()=>{
                  form.hidden = true;
                  successPanel.hidden = false;
            }, 1200);
      }
}

// Tache 4
function initStepNavigation(state){
      const steps =  document.querySelectorAll('.form-step[data-step]');
      const nextButtons = document.querySelectorAll('[data-next-step]');
      const prevButtons = document.querySelectorAll('[data-prev-step]');

      function showStep(stepNumber){
            steps.forEach((section)=>{
                  section.classList.toggle('is-active', section.dataset.step === String(stepNumber));
            });

            updateStepper(stepNumber);
            state.currentStep = stepNumber;

            document.querySelector('.card').scrollIntoView({behavior: 'smooth', block: 'start'});
      }

      nextButtons.forEach((btn)=>{
            btn.addEventListener('click', ()=>{
                  const currentSection = document.querySelector(`.form-step[data-step="${state.currentStep}"]`);

                  if(!validateStep(currentSection)) return;

                  if(state.currentStep < state.totalSteps){
                        showStep(state.currentStep + 1);
                  }
            });
      });

      prevButtons.forEach((btn)=>{
            btn.addEventListener('click', ()=>{
                  if(state.currentStep > 1) showStep(state.currentStep - 1);
            });
      });

      state.showStep = showStep;
}

function updateStepper(stepNumber){
      document.querySelectorAll('.stepper__item').forEach((item)=>{
            const itemStep = Number(item.dataset.stepIndicator);
            item.classList.toggle('is-active', itemStep === stepNumber);
            item.classList.toggle('is-complete', itemStep < stepNumber);
      });

      document.querySelectorAll('.stepper__line').forEach((line, index)=>{
            line.classList.toggle('is-filled', stepNumber > index + 1);
      });
}


function validateStep(section){
      let isValid = true;

      const requiredFields = section.querySelectorAll('[required]');
      requiredFields.forEach((field)=>{
            const errorEl = section.querySelector('[data-error-for="${field.id}"]');
            const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();

            if(isEmpty){
                  isValid = false;
                  field.classList.add('has-error');
                  if(errorEl) errorEl.textContent = 'Ce champ est requis';
            } else {
                  field.classList.remove('has-error');
                  if(errorEl) errorEl.textContent = '';
            }
      });

      const otpGroup = section.querySelector('#otpGroup');
      if(otpGroup){
            const otpInputs = Array.from(otpGroup.querySelectorAll('.otp-group__input'));
            const otpComplete = otpInputs.every((input)=>input.value.trim() !== '');
            const otpError = section.querySelector('[data-error-for="otp"]');

            if(!otpComplete){
                  isValid = false;
                  if(otpError) otpError.textContent = 'Merci de saisir le code a 6 chiffres.';
            } else if(otpError) {
                  otpError.textContent = '';
            }
      }

      return isValid;
}

function initPhotoUpload(){
      const button = document.getElementById('photoBtn');
      const input = document.getElementById('photoInput');
      const preview = document.getElementById('photoPreview');
      const icon = document.getElementById('photoIcon');
      if(!button || !input) return;

      button.addEventListener('click', ()=> input.click());

      input.addEventListener('change', ()=>{
            const file = input.files?.[0];
            if(!file) return;

            const reader = new FileReader();
            reader.onload = (event)=>{
                  preview.src = event.target.result;
                  preview.hidden = false;
                  icon.hidden = true;
            };
            reader.readAsDataURL(file);
      });
}

function initEducationManager(state){
      const addBtn = document.getElementById('addEducationBtn');
      const formPanel = document.getElementById('educationForm');
      const cancelBtn = document.getElementById('eduCancelBtn');
      const saveBtn = document.getElementById('eduSaveBtn');
      const degreeInput = document.getElementById('eduDegree');
      const collegeInput = document.getElementById('eduCollege');
      const yearInput = document.getElementById('eduYear');

      function openForm(){
            formPanel.hidden = false;
            degreeInput.focus();
      }

      function resetForm(){
            state.editingId = null;
            degreeInput.value = "";
            collegeInput.value = "";
            yearInput.value = "";
            formPanel.hidden = true;
      }

      addBtn.addEventListener('click', ()=>{
            resetForm();
            openForm();
      });

      cancelBtn.addEventListener('click', resetForm);

      saveBtn.addEventListener('click', ()=>{
            if(!degreeInput.value.trim() || !collegeInput.value.trim()){
                  degreeInput.classList.toggle('has-error', !degreeInput.value.trim());
                  collegeInput.classList.toggle('has-error', !collegeInput.value.trim());
                  return;
            }

            const entry= {
                  degree: degreeInput.value.trim(),
                  college: collegeInput.value.trim(),
                  year: yearInput.value,
            };

            if(state.editingId){
                  updateEducationEntry(state, state.editingId, entry);
            } else {
                  addEducationEntry(state, entry);
            }
            resetForm();
      });

      state.onEditEducation = (id) =>{
            const entry = state.educationList.find((item)=>item.id === id);
            if(!entry) return;
            state.editingId = id;
            degreeInput.value = entry.degree;
            collegeInput.value = entry.college;
            yearInput.value = entry.year;
            openForm();
      };
      state.onDeleteEducation = (id) =>{
            state.educationList = state.educationList.filter((item)=>item.id !== id);
            renderEducationList(state);
      };
}

function addEducationEntry(state, entry){
      state.educationList.push({id: crypto.randomUUID(), ...entry});
      renderEducationList(state);
}

function updateEducationEntry(state, id, newData) {
  state.educationList = state.educationList.map((item) =>
    item.id === id ? { ...item, ...newData } : item
  );
  renderEducationList(state);
}

/** Reconstruit la liste HTML des diplômes à partir de state.educationList */
function renderEducationList(state) {
  const list = document.getElementById('educationList');
  list.innerHTML = '';

  state.educationList.forEach((entry) => {
    const year = entry.year ? new Date(entry.year).getFullYear() : '—';

    const li = document.createElement('li');
    li.className = 'education__item';
    li.innerHTML = `
      <dl>
        <dt>Degree</dt>
        <dd>${escapeHtml(entry.degree)}</dd>
      </dl>
      <dl>
        <dt>College / University</dt>
        <dd>${escapeHtml(entry.college)}</dd>
      </dl>
      <dl>
        <dt>Graduation Year</dt>
        <dd>${year}</dd>
      </dl>
      <div class="education__item-actions">
        <button type="button" class="education__icon-btn" aria-label="Modifier ce diplôme" data-action="edit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button type="button" class="education__icon-btn education__icon-btn--danger" aria-label="Supprimer ce diplôme" data-action="delete">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;

    li.querySelector('[data-action="edit"]').addEventListener('click', () => state.onEditEducation(entry.id));
    li.querySelector('[data-action="delete"]').addEventListener('click', () => state.onDeleteEducation(entry.id));

    list.appendChild(li);
  });
}

/** Échappe les caractères HTML pour éviter toute injection dans la liste dynamique */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   9) CHAMP DE CODE OTP (étape Vérification)
   ============================================================ */
function initOtpInputs() {
  const inputs = Array.from(document.querySelectorAll('.otp-group__input'));
  if (!inputs.length) return;

  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      // Ne garde qu'un seul chiffre par case
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    // Permet de coller un code complet à 6 chiffres d'un coup
    input.addEventListener('paste', (event) => {
      const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
      if (!pasted) return;
      event.preventDefault();
      pasted.split('').slice(0, inputs.length).forEach((digit, i) => {
        if (inputs[i]) inputs[i].value = digit;
      });
      inputs[Math.min(pasted.length, inputs.length) - 1]?.focus();
    });
  });

  const resendBtn = document.getElementById('resendCodeBtn');
  resendBtn?.addEventListener('click', () => {
    resendBtn.textContent = 'Code envoyé ✓';
    resendBtn.disabled = true;
    setTimeout(() => {
      resendBtn.textContent = 'Resend Code';
      resendBtn.disabled = false;
    }, 8000);
  });
}

/* ============================================================
   10) SOUMISSION FINALE DU FORMULAIRE D'INSCRIPTION
   ============================================================ */
function initFormSubmit(state) {
  const form = document.getElementById('signupForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const step3 = document.querySelector('.form-step[data-step="3"]');
    if (!validateStep(step3)) return;

    // Ici, dans une vraie application, on enverrait les données au serveur
    // (fetch/AJAX) avant d'afficher la confirmation.
    document.querySelectorAll('.form-step[data-step]').forEach((section) => {
      section.classList.remove('is-active');
    });
    document.querySelector('.form-success').classList.add('is-active');
    document.getElementById('stepper').style.display = 'none';
  });
}