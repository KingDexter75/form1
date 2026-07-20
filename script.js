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