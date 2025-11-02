// Wait for page load
document.addEventListener("DOMContentLoaded", () => {
    const welcomePage = document.getElementById("welcome-page");
    const gamePage = document.getElementById("game-page");
    const welcomeStartButton = document.getElementById("welcome-start-button");
    const welcomeShowcase = document.getElementById("welcome-pokemon-showcase");
    
    // Easter Egg: Title click (5x) plays ORAS song
    let titleClicks = 0;
    const gameTitle = document.querySelector("h1");
    if (gameTitle) {
        gameTitle.style.cursor = "pointer";
        gameTitle.addEventListener("click", () => {
            titleClicks++;
            if (titleClicks === 5) {
                const audio = new Audio("assets/EasterEgg.mp3");
                audio.volume = 0.015;
                audio.play().catch(e => console.log("Audio play failed:", e));
                gameTitle.style.animation = "rainbow 2s infinite";
                titleClicks = 0;
            }
        });
    }
    
    // Easter Egg: Konami Code (↑↑↓↓←→←→BA)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        if (key === konamiCode[konamiIndex] || e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                activateKonamiMode();
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateKonamiMode() {
        const allPokemon = document.querySelectorAll('.pokemon, .welcome-pokemon-card');
        const colors = ['#00d4ff', '#0066ff', '#6600ff', '#ff0066', '#ff3300'];
        
        allPokemon.forEach((card, index) => {
            let colorIndex = index % colors.length;
            let rotation = 0;
            
            const interval = setInterval(() => {
                card.style.backgroundColor = colors[colorIndex % colors.length];
                card.style.transform = `rotate(${rotation}deg)`;
                colorIndex++;
                rotation += 36;
            }, 500);
            
            setTimeout(() => {
                clearInterval(interval);
                card.style.backgroundColor = '';
                card.style.transform = '';
            }, 5000);
        });
    }
    
    let upsideDownMode = false;
    
    // Easter Egg: Press U for upside down
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'u') {
            upsideDownMode = !upsideDownMode;
            const allPokemon = document.querySelectorAll('.pokemon, .welcome-pokemon-card');
            allPokemon.forEach(card => {
                if (upsideDownMode) {
                    card.style.transform = 'rotate(180deg)';
                } else {
                    card.style.transform = '';
                }
            });
        }
    });
    
    // Easter Egg: Level up sound when beating high score
    function playLevelUpSound() {
        const audio = new Audio('assets/level_up.mp3');
        audio.volume = 0.015;
        audio.play().catch(e => console.log("Level up audio failed:", e));
    }
    
    // Easter Egg: Surprised Pikachu on wrong answers
    function showSurprisedPikachu() {
        const pikachu = document.createElement('div');
        pikachu.style.position = 'fixed';
        pikachu.style.bottom = '20px';
        pikachu.style.right = '20px';
        pikachu.style.width = '150px';
        pikachu.style.height = '150px';
        pikachu.style.zIndex = '9999';
        pikachu.style.transition = 'all 0.3s ease';
        
        const pikachuImg = document.createElement('img');
        pikachuImg.src = 'assets/Shocked_Pikachu.png';
        pikachuImg.style.width = '100%';
        pikachuImg.style.height = '100%';
        pikachuImg.style.objectFit = 'contain';
        pikachuImg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
        
        pikachu.appendChild(pikachuImg);
        document.body.appendChild(pikachu);
        
        setTimeout(() => {
            pikachu.style.opacity = '0';
            setTimeout(() => {
                pikachu.remove();
            }, 300);
        }, 2000);
    }
    
    // Load random Pokemon for welcome page
    function loadWelcomePokemon() {
        const popularPokemon = [25, 6, 9, 3, 1, 94, 150, 249, 384, 445, 643, 644];
        const usedIndices = [];
        
        for (let i = 0; i < 6; i++) {
            let randomIndex;
            
            do {
                randomIndex = Math.floor(Math.random() * popularPokemon.length);
            } while (usedIndices.includes(randomIndex));
            
            usedIndices.push(randomIndex);
            const id = popularPokemon[randomIndex];
            
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                const welcomeCard = document.createElement("div");
                welcomeCard.classList.add("welcome-pokemon-card");
                
                const img = document.createElement("img");
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                img.alt = data.name;
                
                const name = document.createElement("div");
                name.classList.add("welcome-pokemon-name");
                name.textContent = data.name;
                
                welcomeCard.appendChild(img);
                welcomeCard.appendChild(name);
                welcomeShowcase.appendChild(welcomeCard);
            })
            .catch(error => {
                console.error(error)
            });   
        }
    }
    
    loadWelcomePokemon();
    
    // Switch to game page
    welcomeStartButton.addEventListener("click", () => {
        welcomePage.style.display = "none";
        gamePage.style.display = "block";
    });
    
    // Game variables
    const controlButton = document.getElementsByClassName("controls-overlay")[0];
    const difficultySelect = document.getElementById("difficulty-select");
    const gameBoardSortedCards = document.getElementById("game-board-sorted-cards");
    const gameInfoText = document.getElementById("game-info-text");
    const gameScoreText = document.getElementById("game-score-text");
    const pokemonContainer = document.getElementById("Pokemon-container");
    const generationSelect = document.getElementById("generation-select");
    let usedPokemonIds = [];
    let totalPokemon;
    let generation;
    let isLoading = false;
    let currentScore = 0;
    let triesRemaining = 5;
    let highScore = parseInt(localStorage.getItem("pokemonSortHighScore")) || 0;
    let pokemonStats = {};

    // Drag variables
    let draggedElement = null;
    let draggedFrom = null;
    let clone = null;

    // Pokemon generation ranges
    const generationRanges = {
        "1": { min: 1, max: 151 },
        "2": { min: 152, max: 251 },
        "3": { min: 252, max: 386 },
        "4": { min: 387, max: 493 },
        "5": { min: 494, max: 649 },
        "6": { min: 650, max: 721 },
        "7": { min: 722, max: 809 },
        "8": { min: 810, max: 905 },
        "9": { min: 906, max: 1025 },
        "all": { min: 1, max: 1025 }
    };

    // Start button handler
    controlButton.addEventListener("click", (e) => {
        if (isLoading) {
            return;
        }
        if (controlButton.textContent === "RESET GAME") {
            resetGame();
            return;
        }
        
        isLoading = true;
        controlButton.disabled = true;
        controlButton.textContent = "LOADING...";
        usedPokemonIds = [];
        pokemonContainer.textContent = "";
        gameInfoText.textContent = "Loading Pokémon...";
        currentScore = 0;
        triesRemaining = 5;
        pokemonStats = {};
        gameScoreText.textContent = `Score: ${currentScore} | Tries: ${triesRemaining}/5 | High Score: ${highScore}`;
        gameBoardSortedCards.textContent = "";
        
        generation = generationSelect.value;
        totalPokemon = difficultySelect.value;
        let pokemonAdded = 0;
        
        function fetchPokemon() {
            if (pokemonAdded >= totalPokemon) {
                startGame();
                return;
            }
            
            const range = generationRanges[generation];
            let id = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            
            if (usedPokemonIds.includes(id)) {
                fetchPokemon();
                return;
            }
            
            usedPokemonIds.push(id);
            
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Not 2XX response", {cause: response});
                }
                else return response.json();
            })
            .then(pokemonData => {
                const pokemonElement = document.createElement("div");
                pokemonElement.classList.add("pokemon");
                pokemonElement.id = `pokemon-${id}`;
                pokemonElement.dataset.pokemonId = id;

                const newImage = document.createElement("img");
                newImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                newImage.alt = pokemonData.name;
                pokemonElement.appendChild(newImage);

                const nameElement = document.createElement("div");
                nameElement.classList.add("pokemon-name");
                nameElement.textContent = pokemonData.name;
                nameElement.dataset.originalName = pokemonData.name;
                pokemonElement.appendChild(nameElement);

                let totalStats = 0;
                pokemonData.stats.forEach(stat => {
                    totalStats += stat.base_stat;
                });
                pokemonStats[id] = totalStats;
                
                newImage.addEventListener("error", function() {
                    this.src = "assets/favicon.png";
                    this.style.width = "50px";
                    this.style.height = "50px";
                    this.style.opacity = "0.5";
                    const nameEl = this.parentElement.querySelector(".pokemon-name");
                    if (nameEl && nameEl.dataset.originalName) {
                        nameEl.textContent = "No Pokemon Available";
                    }
                });

                pokemonContainer.appendChild(pokemonElement);
                pokemonAdded++;
                fetchPokemon();
            })
            .catch(error => {
                console.error(error);
                fetchPokemon();
            });
        }
        fetchPokemon();
    });

    // Mouse down handler, start dragging Pokemon card
    function handleMouseDown(e) {
        // Prevent multiple drags at once, since it was making duplicates
        if (draggedElement || clone) {
            return;
        }
        
        // Ignore clicks on buttons or disabled elements
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        
        // Find the Pokemon card being clicked
        let pokemonCard = e.target;
        if (!pokemonCard.classList.contains("pokemon")) {
            pokemonCard = pokemonCard.closest(".pokemon");
        }
        if (!pokemonCard) return;

        e.preventDefault();
        draggedElement = pokemonCard;
        draggedFrom = pokemonCard.parentElement;

        // Create visual clone that follows cursor
        clone = pokemonCard.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.pointerEvents = "none";
        clone.style.zIndex = "1000";
        clone.style.opacity = "0.8";
        clone.w = pokemonCard.offsetWidth / 2; // Store half width for centering
        clone.h = pokemonCard.offsetHeight / 2; // Store half height for centering
        clone.style.left = (e.clientX - clone.w) + "px";
        clone.style.top = (e.clientY - clone.h) + "px";
        document.body.appendChild(clone);
        
        // Make original card transparent while dragging
        pokemonCard.style.opacity = "0.3";
    }

    // Mouse move handler - update clone position while dragging
    function handleMouseMove(e) {
        if (!clone) return;
        clone.style.left = (e.clientX - clone.w) + "px";
        clone.style.top = (e.clientY - clone.h) + "px";
    }

    // Mouse up handler drop card
    function handleMouseUp(e) {
        if (!draggedElement) {
            // remove any that are left behind, since it was making duplicates
            if (clone) {
                clone.remove();
                clone = null;
            }
            return;
        }

        // Remove visual clone
        if (clone) {
            clone.remove();
            clone = null;
        }

        // Restore original card opacity
        draggedElement.style.opacity = "1";
        
        // Find what we're dropping on
        let dropTarget = e.target;
        
        // Check if we're dropping in the unsorted container area
        let isOverUnsorted = false;
        if (dropTarget.id === "Pokemon-container") {
            isOverUnsorted = true;
        } else {
            let parent = dropTarget;
            while (parent && parent !== document.body) {
                if (parent.id === "Pokemon-container") {
                    isOverUnsorted = true;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        
        let scoreDiv = dropTarget.classList.contains("score") ? dropTarget : dropTarget.closest(".score");
        let targetPokemon = dropTarget.classList.contains("pokemon") ? dropTarget : dropTarget.closest(".pokemon");
        
        // Dropping on a score slot
        if (scoreDiv && !isOverUnsorted) {
            const existing = scoreDiv.querySelector(".pokemon");
            const draggedName = draggedElement.querySelector(".pokemon-name");
            
            if (existing && existing !== draggedElement) {
                const existingName = existing.querySelector(".pokemon-name");
                if (draggedName) draggedName.style.display = "none";
                if (existingName && draggedFrom.id === "Pokemon-container") existingName.style.display = "block";
                scoreDiv.appendChild(draggedElement);
                draggedFrom.appendChild(existing);
            } else if (!existing) {
                if (draggedName) draggedName.style.display = "none";
                scoreDiv.appendChild(draggedElement);
            } else {
                draggedFrom.appendChild(draggedElement);
            }
        }
        // Dropping on another Pokemon card in sorted area
        else if (targetPokemon && targetPokemon !== draggedElement && !isOverUnsorted) {
            const draggedName = draggedElement.querySelector(".pokemon-name");
            const targetName = targetPokemon.querySelector(".pokemon-name");
            const targetParent = targetPokemon.parentElement;
            
            if (draggedName) draggedName.style.display = "none";
            if (targetName && draggedFrom.id === "Pokemon-container") {
                targetName.style.display = "block";
            } else if (targetName) {
                targetName.style.display = "none";
            }
            
            targetParent.appendChild(draggedElement);
            draggedFrom.appendChild(targetPokemon);
        }
        // Dropping anywhere in unsorted container area
        else if (isOverUnsorted) {
            const name = draggedElement.querySelector(".pokemon-name");
            if (name) name.style.display = "block";
            pokemonContainer.appendChild(draggedElement);
        }
        // Invalid drop
        else {
            draggedFrom.appendChild(draggedElement);
        }

        draggedElement = null;
        draggedFrom = null;
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    // if somebody is using a autoclicker, removes all the duplicates the autoclicker creates
    setInterval(() => {
        const stuckClones = document.querySelectorAll('.pokemon[style*="position: fixed"]');
        stuckClones.forEach(stuck => {
            if (stuck !== clone) {
                stuck.remove();
            }
        });
    }, 1000);

    // Start the game after loading Pokemon
    function startGame() {
        const genText = generation === "all" ? "All Generations" : `Generation ${generation}`;
        gameInfoText.textContent = `Playing ${genText} • ${totalPokemon} Pokémon • Drag cards to sort by base stat total (lowest to highest)`;
        gameScoreText.textContent = `Score: ${currentScore} | Tries: ${triesRemaining}/5 | High Score: ${highScore}`;
        
        let columns;
        if (totalPokemon <= 5) {
            columns = totalPokemon;
        } else {
            columns = 5;
        }
        
        gameBoardSortedCards.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        gameBoardSortedCards.style.minHeight = 'auto';
        gameBoardSortedCards.textContent = "";

        for (let i = 0; i < totalPokemon; i++) {
            const scorediv = document.createElement("div");
            scorediv.classList.add("score");
            gameBoardSortedCards.appendChild(scorediv);
        }
        
        isLoading = false;
        controlButton.disabled = false;
        controlButton.textContent = "RESET GAME";
        
        let checkButton = document.getElementById("check-order-button");
        if (!checkButton) {
            checkButton = document.createElement("button");
            checkButton.id = "check-order-button";
            checkButton.textContent = "CHECK ORDER";
            checkButton.style.marginTop = "20px";
            checkButton.style.padding = "12px 32px";
            checkButton.style.fontSize = "0.95rem";
            checkButton.style.fontWeight = "700";
            checkButton.style.color = "#000000";
            checkButton.style.background = "#ffffff";
            checkButton.style.border = "none";
            checkButton.style.borderRadius = "8px";
            checkButton.style.cursor = "pointer";
            checkButton.style.fontFamily = "'Orbitron', monospace";
            checkButton.style.letterSpacing = "1px";
            checkButton.style.textTransform = "uppercase";
            
            checkButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent event from bubbling
                checkOrder();
            });
            
            gameBoardSortedCards.parentElement.appendChild(checkButton);
        } else {
            checkButton.disabled = false;
            checkButton.style.opacity = "1";
            checkButton.style.cursor = "pointer";
        }
    }
    
    function checkOrder() {
        const scoreDivs = document.querySelectorAll(".score");
        const pokemonInOrder = [];
        
        scoreDivs.forEach(div => {
            const pokemon = div.querySelector(".pokemon");
            if (pokemon) {
                const pokemonId = parseInt(pokemon.dataset.pokemonId);
                pokemonInOrder.push({
                    baseStatTotal: pokemonStats[pokemonId],
                    scoreDiv: div
                });
            }
        });

        // Reset border colors
        scoreDivs.forEach(div => {
            div.style.borderColor = "#333333";
            div.style.borderWidth = "2px";
        });

        // Check if all Pokemon are sorted
        if (pokemonInOrder.length < totalPokemon) {
            gameInfoText.textContent = `❌ Please sort all ${totalPokemon} Pokémon first! (${pokemonInOrder.length}/${totalPokemon} placed)`;
            gameInfoText.style.color = "#ff4d4d";
            setTimeout(() => {
                const genText = generation === "all" ? "All Generations" : `Generation ${generation}`;
                gameInfoText.textContent = `Playing ${genText} • ${totalPokemon} Pokémon • Drag cards to sort by base stat total (lowest to highest)`;
                gameInfoText.style.color = "#cccccc";
            }, 2000);
            return;
        }
        
        // Sort Pokemon by base stat total to get correct order
        const sortedPokemon = pokemonInOrder.slice().sort((a, b) => a.baseStatTotal - b.baseStatTotal);
        
        let isCorrect = true;
        let errorCount = 0;

        // Compare player's order with correct order
        for (let i = 0; i < pokemonInOrder.length; i++) {
            const currentStat = pokemonInOrder[i].baseStatTotal;
            const correctStat = sortedPokemon[i].baseStatTotal;
            
            // Mark incorrect positions with red border
            if (currentStat !== correctStat) {
                isCorrect = false;
                errorCount++;
                pokemonInOrder[i].scoreDiv.style.setProperty("border-color", "#ff4d4d", "important");
                pokemonInOrder[i].scoreDiv.style.setProperty("border-width", "4px", "important");
            }
        }
        
        // Handle correct answer
        if (isCorrect) {
            currentScore++;
            
            // Update high score if beaten
            if (currentScore > highScore) {
                highScore = currentScore;
                localStorage.setItem("pokemonSortHighScore", highScore);
                playLevelUpSound(); // Play level up sound when beating high score
            }
            
            // Disable check button
            const checkButton = document.getElementById("check-order-button");
            if (checkButton) {
                checkButton.disabled = true;
                checkButton.style.opacity = "0.5";
                checkButton.style.cursor = "not-allowed";
            }
            
            // Show success message
            gameInfoText.textContent = "✅ PERFECT! All Pokémon are in correct order! Loading next round...";
            gameInfoText.style.color = "#00ff00";
            gameScoreText.textContent = `Score: ${currentScore} | Tries: ${triesRemaining}/5 | High Score: ${highScore} 🎉`;
            gameScoreText.style.color = "#00ff00";
            
            // Mark all slots green
            scoreDivs.forEach(div => {
                if (div.querySelector(".pokemon")) {
                    div.style.setProperty("border-color", "#00ff00", "important");
                    div.style.setProperty("border-width", "4px", "important");
                }
            });
            
            // Load next round after delay
            setTimeout(() => {
                loadNextRound();
            }, 2000);
        } else {
            // Handle incorrect answer
            triesRemaining--;
            
            // Show Surprised Pikachu on every wrong answer
            showSurprisedPikachu();
            
            // Check if game over
            if (triesRemaining <= 0) {
                gameInfoText.textContent = `💀 GAME OVER! Final Score: ${currentScore} | High Score: ${highScore}`;
                gameInfoText.style.color = "#ff4d4d";
                gameScoreText.textContent = `Final Score: ${currentScore} | High Score: ${highScore}`;
                gameScoreText.style.color = "#ff4d4d";
                
                // Disable check button
                const checkButton = document.getElementById("check-order-button");
                if (checkButton) {
                    checkButton.disabled = true;
                    checkButton.style.opacity = "0.5";
                    checkButton.style.cursor = "not-allowed";
                }
            } else {
                gameInfoText.textContent = `❌ ${errorCount} Pokémon in wrong positions. Red borders show which ones. ${triesRemaining} tries left!`;
                gameInfoText.style.color = "#ff4d4d";
                gameScoreText.textContent = `Score: ${currentScore} | Tries: ${triesRemaining}/5 | High Score: ${highScore}`;
                gameScoreText.style.color = "#ffffff";
            }
        }
    }
    
    // Load new set of Pokemon for next round when you finish a round
    function loadNextRound() {
        // Reset drag state to prevent glitches
        if (clone) {
            clone.remove();
            clone = null;
        }
        draggedElement = null;
        draggedFrom = null;
        
        usedPokemonIds = [];
        pokemonContainer.textContent = "";
        gameBoardSortedCards.textContent = "";
        pokemonStats = {};
        
        gameInfoText.textContent = "Loading new Pokémon...";
        gameInfoText.style.color = "#cccccc";        
        let pokemonAdded = 0;
        
        // Recursively fetch random Pokemon for next round
        function fetchPokemon() {
            if (pokemonAdded >= totalPokemon) {
                startGame();
                return;
            }
            
            // Get random ID within selected generation range
            const range = generationRanges[generation];
            let id = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            
            // Skip if we already have this Pokemon
            if (usedPokemonIds.includes(id)) {
                fetchPokemon();
                return;
            }
            
            usedPokemonIds.push(id);
            // Fetch Pokemon data from PokeAPI
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Not 2XX response", {cause: response});
                }
                else return response.json();
            })
            .then(pokemonData => {
                // Create Pokemon card element
                const pokemonElement = document.createElement("div");
                pokemonElement.classList.add("pokemon");
                pokemonElement.id = `pokemon-${id}`;
                pokemonElement.dataset.pokemonId = id; // Store only ID it prevents cheating

                // Add Pokemon sprite image
                const newImage = document.createElement("img");
                newImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                newImage.alt = pokemonData.name;
                pokemonElement.appendChild(newImage);

                // Add Pokemon name
                const nameElement = document.createElement("div");
                nameElement.classList.add("pokemon-name");
                nameElement.textContent = pokemonData.name;
                nameElement.dataset.originalName = pokemonData.name;
                pokemonElement.appendChild(nameElement);

                // Calculate total base stats and put in JS to prevent cheating
                let totalStats = 0;
                pokemonData.stats.forEach(stat => {
                    totalStats += stat.base_stat;
                });
                pokemonStats[id] = totalStats;
                
                // Handle image loading errors (use fallback image)
                newImage.addEventListener("error", function() {
                    this.src = "assets/favicon.png";
                    this.style.width = "50px";
                    this.style.height = "50px";
                    this.style.opacity = "0.5";
                    const nameEl = this.parentElement.querySelector(".pokemon-name");
                    if (nameEl && nameEl.dataset.originalName) {
                        nameEl.textContent = "No Pokemon Available";
                    }
                });

                pokemonContainer.appendChild(pokemonElement);
                pokemonAdded++;
                fetchPokemon(); // Fetch next Pokemon
            })
            .catch(error => {
                console.error(error);
                fetchPokemon(); // Try again with different Pokemon if error
            });
        }
        fetchPokemon();
    }
    // Reset game to initial state
    function resetGame() {
        // Reset drag state to prevent glitches, since it was making duplicates
        if (clone) {
            clone.remove();
            clone = null;
        }
        draggedElement = null;
        draggedFrom = null;
        
        currentScore = 0;
        triesRemaining = 5;
        usedPokemonIds = [];
        pokemonContainer.textContent = "";
        gameBoardSortedCards.textContent = "";
        
        const checkButton = document.getElementById("check-order-button");
        if (checkButton) {
            checkButton.remove();
        }
        
        gameInfoText.textContent = "Select your generation and difficulty, then click Start Game to begin!";
        gameInfoText.style.color = "#cccccc";
        gameScoreText.textContent = `Score: ${currentScore} | Tries: ${triesRemaining}/5 | High Score: ${highScore}`;
        gameScoreText.style.color = "#ffffff";
        
        controlButton.textContent = "START GAME";
        controlButton.disabled = false;
        isLoading = false;
    }
});