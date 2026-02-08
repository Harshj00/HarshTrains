const ExerciseDatabase = {
    exercises: [
        // ==========================================
        // CHEST EXERCISES
        // ==========================================
        {
            id: 1,
            name: "Barbell Bench Press",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Lie flat on the bench with your eyes under the bar",
                "Grip the bar slightly wider than shoulder-width",
                "Unrack the bar and lower it to your mid-chest",
                "Press the bar back up to the starting position",
                "Keep your feet flat on the floor throughout"
            ],
            tips: "Keep your shoulder blades retracted and maintain a slight arch in your lower back.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },
        {
            id: 2,
            name: "Incline Dumbbell Press",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Set the bench to a 30-45 degree incline",
                "Hold dumbbells at shoulder level with palms facing forward",
                "Press the dumbbells up until arms are extended",
                "Lower the weights back to shoulder level",
                "Keep your core engaged throughout the movement"
            ],
            tips: "Don't let the dumbbells drift too far forward at the top of the movement.",
            muscleHighlights: {
                front: ["front-chest", "front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 3,
            name: "Dumbbell Fly",
            muscle: "chest",
            secondaryMuscles: ["shoulders"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Lie flat on a bench holding dumbbells above your chest",
                "With a slight bend in your elbows, lower the weights out to the sides",
                "Lower until you feel a stretch in your chest",
                "Bring the dumbbells back together above your chest",
                "Squeeze your chest at the top of the movement"
            ],
            tips: "Focus on the stretch and squeeze rather than using heavy weight.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },
        {
            id: 4,
            name: "Cable Crossover",
            muscle: "chest",
            secondaryMuscles: ["shoulders"],
            equipment: "cable",
            difficulty: "intermediate",
            instructions: [
                "Set both pulleys to the highest position",
                "Stand in the center with a slight forward lean",
                "With arms slightly bent, bring handles together in front",
                "Squeeze your chest at the bottom of the movement",
                "Slowly return to the starting position"
            ],
            tips: "Vary the pulley height to target different parts of the chest.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },
        {
            id: 5,
            name: "Push-Up",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders", "core"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Start in a plank position with hands slightly wider than shoulders",
                "Keep your body in a straight line from head to heels",
                "Lower your chest to the ground by bending your elbows",
                "Push back up to the starting position",
                "Keep your core tight throughout the movement"
            ],
            tips: "Don't let your hips sag or pike up during the movement.",
            muscleHighlights: {
                front: ["front-chest", "front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 6,
            name: "Decline Bench Press",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Lie on a decline bench with feet secured",
                "Grip the bar slightly wider than shoulder-width",
                "Unrack and lower the bar to your lower chest",
                "Press the bar back up to full extension",
                "Keep your back flat against the bench"
            ],
            tips: "This targets the lower chest more effectively.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },
        {
            id: 7,
            name: "Machine Chest Press",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders"],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Adjust the seat so handles are at chest level",
                "Grip the handles and press forward",
                "Extend your arms fully without locking elbows",
                "Slowly return to the starting position",
                "Keep your back flat against the pad"
            ],
            tips: "Great for beginners or as a finishing exercise.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },
        {
            id: 8,
            name: "Dumbbell Pullover",
            muscle: "chest",
            secondaryMuscles: ["back", "triceps"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Lie perpendicular across a bench supporting upper back",
                "Hold a dumbbell with both hands above your chest",
                "Lower the dumbbell behind your head in an arc",
                "Pull the dumbbell back over your chest",
                "Keep a slight bend in your elbows throughout"
            ],
            tips: "This also works the lats and serratus muscles.",
            muscleHighlights: {
                front: ["front-chest"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 9,
            name: "Incline Barbell Press",
            muscle: "chest",
            secondaryMuscles: ["triceps", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Set bench to 30-45 degree incline",
                "Grip bar slightly wider than shoulder-width",
                "Unrack and lower to upper chest",
                "Press back up to starting position",
                "Keep feet flat on the floor"
            ],
            tips: "Targets the upper chest and front deltoids.",
            muscleHighlights: {
                front: ["front-chest", "front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 10,
            name: "Pec Deck Machine",
            muscle: "chest",
            secondaryMuscles: ["shoulders"],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Adjust seat height so arms are parallel to floor",
                "Place forearms on pads or grip handles",
                "Bring arms together in front of chest",
                "Squeeze chest muscles at the center",
                "Slowly return to starting position"
            ],
            tips: "Focus on the contraction rather than the weight.",
            muscleHighlights: {
                front: ["front-chest"],
                back: []
            }
        },

        // ==========================================
        // BACK EXERCISES
        // ==========================================
        {
            id: 11,
            name: "Barbell Deadlift",
            muscle: "back",
            secondaryMuscles: ["legs", "core", "forearms"],
            equipment: "barbell",
            difficulty: "advanced",
            instructions: [
                "Stand with feet hip-width apart, bar over mid-foot",
                "Bend at hips and knees to grip the bar",
                "Keep back flat and chest up",
                "Drive through your heels to stand up",
                "Lower the bar by hinging at the hips"
            ],
            tips: "Keep the bar close to your body throughout the lift.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-lower", "back-left-lat", "back-right-lat", "back-traps", "back-left-glute", "back-right-glute"]
            }
        },

        {
            id: 101,
            name: "Chest Supported Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
        "Set an incline bench to 30-45 degrees",
        "Lie face down on the bench with chest supported",
        "Hold dumbbells hanging straight down with arms extended",
        "Pull the dumbbells up towards your hips, squeezing shoulder blades together",
        "Lower the weights with control back to starting position",
        "Keep your chest pressed against the bench throughout"
        ],
        tips: "Great for isolating the back without lower back strain. Focus on squeezing your shoulder blades together at the top.",
        muscleHighlights: {
        front: ["front-left-bicep", "front-right-bicep"],
        back: ["back-left-lat", "back-right-lat", "back-upper", "back-left-delt", "back-right-delt"]
        }
    },
        {
            id: 12,
            name: "Pull-Up",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Hang from a bar with hands wider than shoulder-width",
                "Pull yourself up until chin clears the bar",
                "Lower yourself with control",
                "Keep your core engaged throughout",
                "Avoid swinging or kipping"
            ],
            tips: "If you can't do a full pull-up, use resistance bands for assistance.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat", "back-upper"]
            }
        },
        {
            id: 13,
            name: "Barbell Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Hinge at hips holding barbell with overhand grip",
                "Keep back flat and parallel to ground",
                "Pull the bar to your lower chest",
                "Squeeze shoulder blades together at top",
                "Lower the bar with control"
            ],
            tips: "Don't use momentum to swing the weight up.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat", "back-upper", "back-traps"]
            }
        },
        {
            id: 14,
            name: "Lat Pulldown",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Sit at lat pulldown machine with thighs secured",
                "Grip the bar wider than shoulder-width",
                "Pull the bar down to upper chest",
                "Squeeze your lats at the bottom",
                "Slowly return to starting position"
            ],
            tips: "Don't lean back excessively to pull the weight.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 15,
            name: "Seated Cable Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Sit at the cable row machine with feet on platform",
                "Grab the handle with both hands",
                "Pull the handle to your abdomen",
                "Squeeze shoulder blades together",
                "Extend arms back to starting position"
            ],
            tips: "Keep your torso stationary throughout the movement.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat", "back-upper"]
            }
        },
        {
            id: 16,
            name: "One-Arm Dumbbell Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Place one knee and hand on a bench",
                "Hold dumbbell in the other hand, arm extended",
                "Pull the dumbbell to your hip",
                "Squeeze your lat at the top",
                "Lower with control and repeat"
            ],
            tips: "Keep your back flat and parallel to the ground.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 17,
            name: "T-Bar Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Straddle the T-bar or landmine attachment",
                "Bend at hips and grip the handles",
                "Pull the weight to your chest",
                "Squeeze shoulder blades at the top",
                "Lower with control"
            ],
            tips: "Keep your chest up and core tight throughout.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat", "back-upper", "back-lower"]
            }
        },
        {
            id: 18,
            name: "Chin-Up",
            muscle: "back",
            secondaryMuscles: ["biceps"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Hang from bar with underhand grip, hands shoulder-width",
                "Pull yourself up until chin clears the bar",
                "Lower yourself with control",
                "Keep core engaged throughout",
                "Full extension at the bottom"
            ],
            tips: "This variation emphasizes the biceps more than pull-ups.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 19,
            name: "Face Pull",
            muscle: "back",
            secondaryMuscles: ["shoulders"],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Set cable at upper chest height with rope attachment",
                "Pull the rope towards your face",
                "Separate the rope ends at your ears",
                "Squeeze rear delts and upper back",
                "Return to starting position with control"
            ],
            tips: "Great for shoulder health and rear delt development.",
            muscleHighlights: {
                front: [],
                back: ["back-upper", "back-left-delt", "back-right-delt"]
            }
        },
        {
            id: 20,
            name: "Straight Arm Pulldown",
            muscle: "back",
            secondaryMuscles: ["triceps"],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Stand facing cable machine with bar at high position",
                "Grip bar with straight arms",
                "Pull bar down to thighs keeping arms straight",
                "Squeeze lats at the bottom",
                "Return to starting position with control"
            ],
            tips: "Focus on using your lats, not your arms.",
            muscleHighlights: {
                front: [],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 21,
            name: "Romanian Deadlift",
            muscle: "back",
            secondaryMuscles: ["legs", "core"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Stand holding barbell at hip level",
                "Push hips back while lowering the bar",
                "Keep legs nearly straight with slight knee bend",
                "Lower until you feel hamstring stretch",
                "Drive hips forward to return to start"
            ],
            tips: "Keep the bar close to your legs throughout.",
            muscleHighlights: {
                front: [],
                back: ["back-lower", "back-left-hamstring", "back-right-hamstring", "back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 22,
            name: "Rack Pull",
            muscle: "back",
            secondaryMuscles: ["legs", "forearms"],
            equipment: "barbell",
            difficulty: "advanced",
            instructions: [
                "Set bar in rack at knee height",
                "Grip bar and set your back flat",
                "Stand up by driving through heels",
                "Lock out at the top",
                "Lower bar back to the rack"
            ],
            tips: "Allows you to use heavier weight than full deadlifts.",
            muscleHighlights: {
                front: [],
                back: ["back-traps", "back-upper", "back-lower"]
            }
        },

        // ==========================================
        // SHOULDER EXERCISES
        // ==========================================
        {
            id: 23,
            name: "Overhead Press",
            muscle: "shoulders",
            secondaryMuscles: ["triceps", "core"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Stand with feet shoulder-width apart",
                "Hold barbell at shoulder level",
                "Press the bar overhead until arms are extended",
                "Lower the bar back to shoulders",
                "Keep core tight throughout"
            ],
            tips: "Don't lean back excessively at the top.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 24,
            name: "Dumbbell Shoulder Press",
            muscle: "shoulders",
            secondaryMuscles: ["triceps"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Sit or stand with dumbbells at shoulder level",
                "Press dumbbells overhead until arms are extended",
                "Lower dumbbells back to shoulder level",
                "Keep core engaged throughout",
                "Don't let elbows flare out too wide"
            ],
            tips: "Seated version provides more stability.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 25,
            name: "Lateral Raise",
            muscle: "shoulders",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand with dumbbells at your sides",
                "Raise arms out to the sides until parallel to floor",
                "Keep a slight bend in your elbows",
                "Lower with control",
                "Don't swing the weights"
            ],
            tips: "Use lighter weight and focus on form.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 26,
            name: "Front Raise",
            muscle: "shoulders",
            secondaryMuscles: ["chest"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand with dumbbells in front of thighs",
                "Raise one or both arms in front to shoulder height",
                "Keep a slight bend in elbows",
                "Lower with control",
                "Alternate arms or do both together"
            ],
            tips: "Don't swing or use momentum.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 27,
            name: "Reverse Fly",
            muscle: "shoulders",
            secondaryMuscles: ["back"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Bend at hips with dumbbells hanging down",
                "Raise arms out to sides, squeezing rear delts",
                "Keep slight bend in elbows",
                "Lower with control",
                "Keep back flat throughout"
            ],
            tips: "Focus on squeezing the rear delts.",
            muscleHighlights: {
                front: [],
                back: ["back-left-delt", "back-right-delt", "back-upper"]
            }
        },
        {
            id: 28,
            name: "Arnold Press",
            muscle: "shoulders",
            secondaryMuscles: ["triceps"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Start with dumbbells at shoulder level, palms facing you",
                "Press up while rotating palms to face forward",
                "At top, palms should face forward",
                "Reverse the motion on the way down",
                "Keep the movement smooth and controlled"
            ],
            tips: "This hits all three heads of the deltoid.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-delt", "back-right-delt"]
            }
        },
        {
            id: 29,
            name: "Upright Row",
            muscle: "shoulders",
            secondaryMuscles: ["biceps", "back"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Stand holding barbell with overhand grip",
                "Pull bar up to chest level, elbows high",
                "Keep bar close to body",
                "Lower with control",
                "Don't go too heavy to avoid shoulder strain"
            ],
            tips: "Wide grip is easier on the shoulders.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-traps"]
            }
        },
        {
            id: 30,
            name: "Cable Lateral Raise",
            muscle: "shoulders",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Stand sideways to cable machine, handle at low position",
                "Raise arm out to side until parallel to floor",
                "Keep slight bend in elbow",
                "Lower with control",
                "Switch sides and repeat"
            ],
            tips: "Constant tension from cable provides great stimulus.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 31,
            name: "Machine Shoulder Press",
            muscle: "shoulders",
            secondaryMuscles: ["triceps"],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Adjust seat so handles are at shoulder level",
                "Press handles overhead",
                "Extend arms without locking elbows",
                "Lower with control",
                "Keep back against pad"
            ],
            tips: "Good for beginners or as a finishing exercise.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: []
            }
        },
        {
            id: 32,
            name: "Shrugs",
            muscle: "shoulders",
            secondaryMuscles: ["back"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand holding dumbbells at your sides",
                "Shrug shoulders up towards ears",
                "Hold at the top briefly",
                "Lower with control",
                "Keep arms straight throughout"
            ],
            tips: "Don't roll your shoulders, just up and down.",
            muscleHighlights: {
                front: [],
                back: ["back-traps"]
            }
        },

        // ==========================================
        // BICEPS EXERCISES
        // ==========================================
        {
            id: 33,
            name: "Barbell Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "barbell",
            difficulty: "beginner",
            instructions: [
                "Stand holding barbell with underhand grip",
                "Curl the bar up to shoulder level",
                "Keep elbows at your sides",
                "Lower with control",
                "Don't swing your body"
            ],
            tips: "Keep your upper arms stationary throughout.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep", "front-left-forearm", "front-right-forearm"],
                back: []
            }
        },
        {
            id: 34,
            name: "Dumbbell Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand holding dumbbells at your sides",
                "Curl weights up while rotating palms up",
                "Squeeze biceps at the top",
                "Lower with control",
                "Alternate arms or do both together"
            ],
            tips: "Supinate (rotate) your wrists for full bicep activation.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 35,
            name: "Hammer Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand holding dumbbells with neutral grip (palms facing each other)",
                "Curl weights up keeping neutral grip",
                "Squeeze at the top",
                "Lower with control",
                "Keep elbows at your sides"
            ],
            tips: "This targets the brachialis and forearms more.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep", "front-left-forearm", "front-right-forearm"],
                back: []
            }
        },
        {
            id: 36,
            name: "Preacher Curl",
            muscle: "biceps",
            secondaryMuscles: [],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Sit at preacher bench with arms over pad",
                "Hold barbell with underhand grip",
                "Curl bar up towards shoulders",
                "Lower with control",
                "Don't let arms fully extend at bottom"
            ],
            tips: "Great for isolating the biceps.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 37,
            name: "Concentration Curl",
            muscle: "biceps",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Sit on bench with elbow braced against inner thigh",
                "Hold dumbbell with arm extended",
                "Curl weight up to shoulder",
                "Squeeze bicep at the top",
                "Lower with control"
            ],
            tips: "Focus on the mind-muscle connection.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 38,
            name: "Cable Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Stand facing cable machine with bar at low position",
                "Curl bar up to shoulder level",
                "Keep elbows at your sides",
                "Lower with control",
                "Maintain constant tension"
            ],
            tips: "Cables provide constant tension throughout the movement.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 39,
            name: "Incline Dumbbell Curl",
            muscle: "biceps",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Lie back on incline bench with dumbbells hanging",
                "Curl weights up while keeping upper arms stationary",
                "Squeeze biceps at the top",
                "Lower with control",
                "Feel the stretch at the bottom"
            ],
            tips: "The incline position stretches the bicep for better activation.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 40,
            name: "Spider Curl",
            muscle: "biceps",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Lie face down on incline bench",
                "Let arms hang straight down with dumbbells",
                "Curl weights up squeezing biceps",
                "Lower with control",
                "Keep upper arms perpendicular to floor"
            ],
            tips: "Great for peak bicep contraction.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 41,
            name: "EZ Bar Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "barbell",
            difficulty: "beginner",
            instructions: [
                "Stand holding EZ bar on the angled grips",
                "Curl the bar up to shoulder level",
                "Keep elbows at your sides",
                "Lower with control",
                "Don't swing your body"
            ],
            tips: "The angled grip is easier on the wrists.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },
        {
            id: 42,
            name: "21s",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Do 7 reps from bottom to halfway up",
                "Do 7 reps from halfway to top",
                "Do 7 full range of motion reps",
                "Keep continuous tension",
                "Use lighter weight than normal curls"
            ],
            tips: "Great finisher exercise for biceps.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: []
            }
        },

        // ==========================================
        // TRICEPS EXERCISES
        // ==========================================
        {
            id: 43,
            name: "Tricep Pushdown",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Stand at cable machine with bar at high position",
                "Push bar down until arms are fully extended",
                "Keep elbows at your sides",
                "Return to starting position with control",
                "Don't let elbows flare out"
            ],
            tips: "Squeeze the triceps at the bottom of the movement.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 44,
            name: "Skull Crushers",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Lie on bench holding barbell above chest",
                "Lower bar to forehead by bending elbows",
                "Keep upper arms stationary",
                "Extend arms back to starting position",
                "Don't flare elbows out"
            ],
            tips: "Use an EZ bar for easier wrist position.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 45,
            name: "Close Grip Bench Press",
            muscle: "triceps",
            secondaryMuscles: ["chest", "shoulders"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Lie on bench and grip bar with hands shoulder-width apart",
                "Lower bar to lower chest",
                "Press back up to full extension",
                "Keep elbows close to body",
                "Don't bounce the bar off chest"
            ],
            tips: "This also works the chest but emphasizes triceps.",
            muscleHighlights: {
                front: ["front-chest"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 46,
            name: "Overhead Tricep Extension",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Hold dumbbell overhead with both hands",
                "Lower dumbbell behind head by bending elbows",
                "Keep upper arms close to ears",
                "Extend arms back up",
                "Don't let elbows flare out"
            ],
            tips: "Can be done seated or standing.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 47,
            name: "Tricep Dips",
            muscle: "triceps",
            secondaryMuscles: ["chest", "shoulders"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Support yourself on parallel bars or bench",
                "Lower body by bending elbows to 90 degrees",
                "Keep elbows close to body for tricep focus",
                "Push back up to starting position",
                "Don't go too deep to protect shoulders"
            ],
            tips: "Lean forward slightly to emphasize chest more.",
            muscleHighlights: {
                front: ["front-chest"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 48,
            name: "Rope Pushdown",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Attach rope to high cable",
                "Push rope down and separate at the bottom",
                "Squeeze triceps at full extension",
                "Return with control",
                "Keep elbows at your sides"
            ],
            tips: "The rope allows for better tricep contraction.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 49,
            name: "Kickbacks",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Bend over with upper arm parallel to floor",
                "Extend arm back until straight",
                "Squeeze tricep at the top",
                "Lower with control",
                "Keep upper arm stationary"
            ],
            tips: "Use lighter weight and focus on the contraction.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 50,
            name: "Diamond Push-Up",
            muscle: "triceps",
            secondaryMuscles: ["chest", "shoulders"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Start in push-up position with hands together forming diamond",
                "Lower chest to hands",
                "Push back up to starting position",
                "Keep core tight throughout",
                "Keep elbows close to body"
            ],
            tips: "Harder than regular push-ups, targets triceps more.",
            muscleHighlights: {
                front: ["front-chest"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 51,
            name: "Overhead Cable Extension",
            muscle: "triceps",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "beginner",
            instructions: [
                "Face away from cable machine with rope at low position",
                "Hold rope overhead with arms bent",
                "Extend arms forward and up",
                "Squeeze triceps at full extension",
                "Return with control"
            ],
            tips: "Great stretch and contraction for triceps.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 52,
            name: "Bench Dips",
            muscle: "triceps",
            secondaryMuscles: ["shoulders"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Place hands on bench behind you",
                "Extend legs out in front",
                "Lower body by bending elbows",
                "Push back up to starting position",
                "Keep back close to the bench"
            ],
            tips: "Bend knees to make it easier.",
            muscleHighlights: {
                front: [],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },

        // ==========================================
        // LEG EXERCISES
        // ==========================================
        {
            id: 53,
            name: "Barbell Squat",
            muscle: "legs",
            secondaryMuscles: ["core", "back"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Position bar on upper back, not neck",
                "Stand with feet shoulder-width apart",
                "Squat down until thighs are parallel to floor",
                "Drive through heels to stand up",
                "Keep chest up and core tight"
            ],
            tips: "Don't let knees cave inward.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute", "back-left-hamstring", "back-right-hamstring"]
            }
        },
        {
            id: 54,
            name: "Leg Press",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Sit in leg press machine with feet shoulder-width on platform",
                "Lower the platform by bending knees",
                "Press back up without locking knees",
                "Keep lower back against the pad",
                "Control the weight throughout"
            ],
            tips: "Foot position changes muscle emphasis.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 55,
            name: "Leg Extension",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Sit in machine with pad on lower shins",
                "Extend legs until straight",
                "Squeeze quads at the top",
                "Lower with control",
                "Don't use momentum"
            ],
            tips: "Great isolation exercise for quads.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: []
            }
        },
        {
            id: 56,
            name: "Leg Curl",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Lie face down on leg curl machine",
                "Curl heels towards glutes",
                "Squeeze hamstrings at the top",
                "Lower with control",
                "Keep hips pressed into the pad"
            ],
            tips: "Can also be done seated or standing.",
            muscleHighlights: {
                front: [],
                back: ["back-left-hamstring", "back-right-hamstring"]
            }
        },
        {
            id: 57,
            name: "Lunges",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Stand with feet together",
                "Step forward into a lunge position",
                "Lower back knee towards the ground",
                "Push off front foot to return",
                "Alternate legs or do one leg at a time"
            ],
            tips: "Keep torso upright throughout.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 58,
            name: "Bulgarian Split Squat",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Place rear foot on bench behind you",
                "Hold dumbbells at your sides",
                "Lower into a lunge position",
                "Drive through front heel to stand",
                "Keep torso upright"
            ],
            tips: "Great for addressing leg imbalances.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 59,
            name: "Goblet Squat",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Hold dumbbell at chest level",
                "Stand with feet wider than shoulder-width",
                "Squat down keeping chest up",
                "Drive through heels to stand",
                "Keep weight at chest throughout"
            ],
            tips: "Great for learning proper squat form.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 60,
            name: "Hip Thrust",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Sit with upper back against bench",
                "Roll barbell over hips",
                "Drive hips up squeezing glutes",
                "Lower with control",
                "Keep chin tucked throughout"
            ],
            tips: "Best exercise for glute development.",
            muscleHighlights: {
                front: [],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 61,
            name: "Calf Raise",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Stand on calf raise machine with shoulders under pads",
                "Rise up onto your toes",
                "Squeeze calves at the top",
                "Lower heels below platform level",
                "Control the movement throughout"
            ],
            tips: "Full range of motion is key for calf development.",
            muscleHighlights: {
                front: ["front-left-calf", "front-right-calf"],
                back: ["back-left-calf", "back-right-calf"]
            }
        },
        {
            id: 62,
            name: "Front Squat",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "barbell",
            difficulty: "advanced",
            instructions: [
                "Position bar on front of shoulders",
                "Cross arms to hold bar or use clean grip",
                "Squat down keeping elbows up",
                "Drive through heels to stand",
                "Keep torso as upright as possible"
            ],
            tips: "More quad-dominant than back squat.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 63,
            name: "Sumo Squat",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand with feet wide and toes pointed out",
                "Hold dumbbell between legs",
                "Squat down keeping knees over toes",
                "Drive through heels to stand",
                "Squeeze glutes at the top"
            ],
            tips: "Targets inner thighs and glutes more.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 64,
            name: "Step-Up",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Stand facing a bench or box",
                "Step up with one foot driving through heel",
                "Bring other foot up to stand on platform",
                "Step back down with control",
                "Alternate legs or complete one side first"
            ],
            tips: "Use a higher platform to increase difficulty.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 65,
            name: "Hack Squat",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "intermediate",
            instructions: [
                "Position yourself in hack squat machine",
                "Place feet shoulder-width on platform",
                "Lower by bending knees to 90 degrees",
                "Press back up without locking knees",
                "Keep back flat against pad"
            ],
            tips: "Great for quad development with less lower back stress.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 66,
            name: "Glute Bridge",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lie on back with knees bent, feet flat on floor",
                "Drive hips up by squeezing glutes",
                "Hold at the top briefly",
                "Lower with control",
                "Keep core engaged throughout"
            ],
            tips: "Great warm-up or activation exercise.",
            muscleHighlights: {
                front: [],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 67,
            name: "Seated Calf Raise",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "machine",
            difficulty: "beginner",
            instructions: [
                "Sit at seated calf machine with knees under pad",
                "Rise up onto your toes",
                "Squeeze calves at the top",
                "Lower heels as far as possible",
                "Control the movement throughout"
            ],
            tips: "Targets the soleus muscle of the calf.",
            muscleHighlights: {
                front: ["front-left-calf", "front-right-calf"],
                back: ["back-left-calf", "back-right-calf"]
            }
        },
        {
            id: 68,
            name: "Walking Lunges",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Hold dumbbells at your sides",
                "Step forward into a lunge",
                "Push off back foot and step into next lunge",
                "Continue walking forward",
                "Keep torso upright throughout"
            ],
            tips: "Great for functional strength and balance.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },

        // ==========================================
        // CORE EXERCISES
        // ==========================================
        {
            id: 69,
            name: "Plank",
            muscle: "core",
            secondaryMuscles: ["shoulders"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Start in push-up position on forearms",
                "Keep body in a straight line",
                "Engage core and squeeze glutes",
                "Hold the position",
                "Don't let hips sag or pike up"
            ],
            tips: "Start with 20-30 seconds and build up.",
            muscleHighlights: {
                front: ["front-abs", "front-left-oblique", "front-right-oblique"],
                back: []
            }
        },
        {
            id: 70,
            name: "Crunches",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lie on back with knees bent, feet flat",
                "Place hands behind head or across chest",
                "Curl shoulders off the ground",
                "Squeeze abs at the top",
                "Lower with control"
            ],
            tips: "Don't pull on your neck.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 71,
            name: "Leg Raise",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Lie on back with legs straight",
                "Place hands under lower back for support",
                "Raise legs until perpendicular to floor",
                "Lower with control without touching floor",
                "Keep lower back pressed into ground"
            ],
            tips: "Bend knees slightly if needed.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 72,
            name: "Russian Twist",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Sit with knees bent, lean back slightly",
                "Hold hands together or hold a weight",
                "Rotate torso to one side",
                "Rotate to the other side",
                "Keep core engaged throughout"
            ],
            tips: "Lift feet off ground to make it harder.",
            muscleHighlights: {
                front: ["front-abs", "front-left-oblique", "front-right-oblique"],
                back: []
            }
        },
        {
            id: 73,
            name: "Mountain Climbers",
            muscle: "core",
            secondaryMuscles: ["shoulders", "legs"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Start in push-up position",
                "Drive one knee towards chest",
                "Quickly switch legs",
                "Continue alternating at a fast pace",
                "Keep hips down and core tight"
            ],
            tips: "Great for cardio and core conditioning.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 74,
            name: "Dead Bug",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lie on back with arms extended to ceiling",
                "Raise legs with knees bent at 90 degrees",
                "Lower opposite arm and leg towards floor",
                "Return to start and switch sides",
                "Keep lower back pressed into floor"
            ],
            tips: "Great for core stability and coordination.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 75,
            name: "Bicycle Crunches",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lie on back with hands behind head",
                "Lift shoulders off ground",
                "Bring one elbow to opposite knee",
                "Extend other leg straight",
                "Alternate sides in a pedaling motion"
            ],
            tips: "Don't pull on your neck.",
            muscleHighlights: {
                front: ["front-abs", "front-left-oblique", "front-right-oblique"],
                back: []
            }
        },
        {
            id: 76,
            name: "Hanging Leg Raise",
            muscle: "core",
            secondaryMuscles: ["forearms"],
            equipment: "bodyweight",
            difficulty: "advanced",
            instructions: [
                "Hang from a pull-up bar",
                "Keep legs straight or slightly bent",
                "Raise legs until parallel to floor or higher",
                "Lower with control",
                "Don't swing"
            ],
            tips: "Bend knees to make it easier.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 77,
            name: "Ab Wheel Rollout",
            muscle: "core",
            secondaryMuscles: ["shoulders", "back"],
            equipment: "bodyweight",
            difficulty: "advanced",
            instructions: [
                "Kneel on floor holding ab wheel",
                "Roll wheel forward extending your body",
                "Go as far as you can while maintaining form",
                "Roll back to starting position",
                "Keep core tight throughout"
            ],
            tips: "Start with partial range of motion.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 78,
            name: "Side Plank",
            muscle: "core",
            secondaryMuscles: ["shoulders"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Lie on side with forearm on ground",
                "Lift hips off ground",
                "Keep body in straight line",
                "Hold the position",
                "Switch sides"
            ],
            tips: "Great for oblique development.",
            muscleHighlights: {
                front: ["front-left-oblique", "front-right-oblique"],
                back: []
            }
        },
        {
            id: 79,
            name: "Cable Crunch",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "intermediate",
            instructions: [
                "Kneel below a high cable with rope attachment",
                "Hold rope behind head",
                "Crunch down bringing elbows to knees",
                "Squeeze abs at the bottom",
                "Return to starting position"
            ],
            tips: "Use your abs, not your arms to pull.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 80,
            name: "Pallof Press",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "cable",
            difficulty: "intermediate",
            instructions: [
                "Stand sideways to cable machine",
                "Hold handle at chest with both hands",
                "Press handle straight out in front",
                "Resist the rotation of your torso",
                "Return to chest and repeat"
            ],
            tips: "Anti-rotation is key for core stability.",
            muscleHighlights: {
                front: ["front-abs", "front-left-oblique", "front-right-oblique"],
                back: []
            }
        },
        {
            id: 81,
            name: "Toe Touch",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lie on back with legs raised to ceiling",
                "Reach hands towards toes",
                "Lift shoulders off ground",
                "Try to touch your toes",
                "Lower with control and repeat"
            ],
            tips: "Keep legs as straight as possible.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },
        {
            id: 82,
            name: "V-Up",
            muscle: "core",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Lie flat with arms extended overhead",
                "Simultaneously lift legs and torso",
                "Reach hands towards toes",
                "Form a V shape at the top",
                "Lower with control and repeat"
            ],
            tips: "Keep legs and arms straight.",
            muscleHighlights: {
                front: ["front-abs"],
                back: []
            }
        },

        // ==========================================
        // FOREARM EXERCISES
        // ==========================================
        {
            id: 83,
            name: "Wrist Curl",
            muscle: "forearms",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Sit with forearms resting on thighs",
                "Hold dumbbells with palms facing up",
                "Let wrists extend down",
                "Curl wrists up",
                "Lower with control"
            ],
            tips: "Use light weight and higher reps.",
            muscleHighlights: {
                front: ["front-left-forearm", "front-right-forearm"],
                back: []
            }
        },
        {
            id: 84,
            name: "Reverse Wrist Curl",
            muscle: "forearms",
            secondaryMuscles: [],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Sit with forearms resting on thighs",
                "Hold dumbbells with palms facing down",
                "Let wrists bend down",
                "Curl wrists up",
                "Lower with control"
            ],
            tips: "Works the top of the forearm.",
            muscleHighlights: {
                front: ["front-left-forearm", "front-right-forearm"],
                back: ["back-left-forearm", "back-right-forearm"]
            }
        },
        {
            id: 85,
            name: "Farmer's Walk",
            muscle: "forearms",
            secondaryMuscles: ["core", "shoulders", "legs"],
            equipment: "dumbbell",
            difficulty: "beginner",
            instructions: [
                "Hold heavy dumbbells at your sides",
                "Stand tall with shoulders back",
                "Walk forward with controlled steps",
                "Keep core tight throughout",
                "Walk for distance or time"
            ],
            tips: "Great for grip strength and overall conditioning.",
            muscleHighlights: {
                front: ["front-left-forearm", "front-right-forearm"],
                back: ["back-traps"]
            }
        },
        {
            id: 86,
            name: "Dead Hang",
            muscle: "forearms",
            secondaryMuscles: ["back", "shoulders"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Hang from a pull-up bar with arms fully extended",
                "Keep shoulders engaged",
                "Hold as long as possible",
                "Rest and repeat",
                "Track your time to measure progress"
            ],
            tips: "Great for grip endurance and shoulder health.",
            muscleHighlights: {
                front: ["front-left-forearm", "front-right-forearm"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },

        // ==========================================
        // ADDITIONAL COMPOUND EXERCISES
        // ==========================================
        {
            id: 87,
            name: "Clean and Press",
            muscle: "shoulders",
            secondaryMuscles: ["legs", "back", "core"],
            equipment: "barbell",
            difficulty: "advanced",
            instructions: [
                "Start with barbell on ground",
                "Clean the bar to shoulder position",
                "Press the bar overhead",
                "Lower to shoulders then to ground",
                "Keep core tight throughout"
            ],
            tips: "Full body exercise, great for power.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder", "front-left-quad", "front-right-quad"],
                back: ["back-traps", "back-lower"]
            }
        },
        {
            id: 88,
            name: "Thruster",
            muscle: "legs",
            secondaryMuscles: ["shoulders", "core"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Hold barbell in front rack position",
                "Squat down to parallel",
                "Drive up explosively",
                "Press bar overhead at the top",
                "Lower bar and repeat"
            ],
            tips: "Great for conditioning and strength.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad", "front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 89,
            name: "Renegade Row",
            muscle: "back",
            secondaryMuscles: ["core", "shoulders", "triceps"],
            equipment: "dumbbell",
            difficulty: "advanced",
            instructions: [
                "Start in push-up position holding dumbbells",
                "Perform a push-up",
                "Row one dumbbell to your hip",
                "Lower and row the other side",
                "Keep hips square to the ground"
            ],
            tips: "Great for core stability and back strength.",
            muscleHighlights: {
                front: ["front-chest", "front-abs"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 90,
            name: "Turkish Get-Up",
            muscle: "core",
            secondaryMuscles: ["shoulders", "legs"],
            equipment: "dumbbell",
            difficulty: "advanced",
            instructions: [
                "Lie on back holding weight above shoulder",
                "Follow sequence to stand up",
                "Keep arm locked out throughout",
                "Reverse the sequence to return",
                "Switch arms and repeat"
            ],
            tips: "Complex movement, learn without weight first.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder", "front-abs"],
                back: []
            }
        },
        {
            id: 91,
            name: "Burpee",
            muscle: "core",
            secondaryMuscles: ["chest", "shoulders", "legs"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Start standing",
                "Drop into squat and place hands on floor",
                "Jump feet back to push-up position",
                "Perform a push-up (optional)",
                "Jump feet forward and jump up with hands overhead"
            ],
            tips: "Great for conditioning and fat loss.",
            muscleHighlights: {
                front: ["front-chest", "front-left-quad", "front-right-quad", "front-abs"],
                back: []
            }
        },
        {
            id: 92,
            name: "Box Jump",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Stand facing a sturdy box or platform",
                "Bend knees and swing arms back",
                "Explode up onto the box",
                "Land softly with bent knees",
                "Step down and repeat"
            ],
            tips: "Start with lower box and progress up.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad", "front-left-calf", "front-right-calf"],
                back: ["back-left-glute", "back-right-glute"]
            }
        },
        {
            id: 93,
            name: "Kettlebell Swing",
            muscle: "back",
            secondaryMuscles: ["legs", "shoulders", "core"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Stand with feet wider than shoulders",
                "Hold kettlebell with both hands",
                "Hinge at hips letting weight swing back",
                "Drive hips forward swinging weight to chest height",
                "Let weight swing back and repeat"
            ],
            tips: "Power comes from hips, not arms.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-glute", "back-right-glute", "back-left-hamstring", "back-right-hamstring", "back-lower"]
            }
        },
        {
            id: 94,
            name: "Wall Sit",
            muscle: "legs",
            secondaryMuscles: [],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Lean against wall with feet shoulder-width apart",
                "Slide down until thighs are parallel to floor",
                "Keep knees at 90 degrees",
                "Hold the position",
                "Keep back flat against wall"
            ],
            tips: "Great isometric exercise for quads.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: []
            }
        },
        {
            id: 95,
            name: "Inverted Row",
            muscle: "back",
            secondaryMuscles: ["biceps", "core"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Set bar at waist height on rack",
                "Hang underneath with straight body",
                "Pull chest to bar",
                "Lower with control",
                "Keep body straight throughout"
            ],
            tips: "Great for beginners working towards pull-ups.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat", "back-upper"]
            }
        },
        {
            id: 96,
            name: "Pike Push-Up",
            muscle: "shoulders",
            secondaryMuscles: ["triceps"],
            equipment: "bodyweight",
            difficulty: "intermediate",
            instructions: [
                "Start in downward dog position",
                "Hands and feet on floor, hips high",
                "Bend elbows and lower head to floor",
                "Push back up to starting position",
                "Keep legs as straight as possible"
            ],
            tips: "Progression towards handstand push-ups.",
            muscleHighlights: {
                front: ["front-left-shoulder", "front-right-shoulder"],
                back: ["back-left-tricep", "back-right-tricep"]
            }
        },
        {
            id: 97,
            name: "Good Morning",
            muscle: "back",
            secondaryMuscles: ["legs"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Place barbell on upper back",
                "Stand with feet shoulder-width apart",
                "Hinge at hips pushing them back",
                "Lower torso until nearly parallel to floor",
                "Drive hips forward to stand"
            ],
            tips: "Use light weight and focus on hamstring stretch.",
            muscleHighlights: {
                front: [],
                back: ["back-lower", "back-left-hamstring", "back-right-hamstring"]
            }
        },
        {
            id: 98,
            name: "Meadows Row",
            muscle: "back",
            secondaryMuscles: ["biceps"],
            equipment: "barbell",
            difficulty: "intermediate",
            instructions: [
                "Stand perpendicular to landmine barbell",
                "Hinge at hips and grab end of barbell",
                "Row the bar to your hip",
                "Squeeze lat at the top",
                "Lower with control and repeat"
            ],
            tips: "Great for lat development.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep"],
                back: ["back-left-lat", "back-right-lat"]
            }
        },
        {
            id: 99,
            name: "Zottman Curl",
            muscle: "biceps",
            secondaryMuscles: ["forearms"],
            equipment: "dumbbell",
            difficulty: "intermediate",
            instructions: [
                "Hold dumbbells with palms facing forward",
                "Curl weights up normally",
                "At the top, rotate palms to face down",
                "Lower with palms down (reverse curl)",
                "Rotate palms back up at bottom and repeat"
            ],
            tips: "Works both biceps and forearms effectively.",
            muscleHighlights: {
                front: ["front-left-bicep", "front-right-bicep", "front-left-forearm", "front-right-forearm"],
                back: []
            }
        },
        {
            id: 100,
            name: "Reverse Lunge",
            muscle: "legs",
            secondaryMuscles: ["core"],
            equipment: "bodyweight",
            difficulty: "beginner",
            instructions: [
                "Stand with feet together",
                "Step backward into a lunge",
                "Lower back knee towards ground",
                "Push off back foot to return",
                "Alternate legs"
            ],
            tips: "Easier on knees than forward lunges.",
            muscleHighlights: {
                front: ["front-left-quad", "front-right-quad"],
                back: ["back-left-glute", "back-right-glute"]
            }
        }
    ],

    // ==========================================
    // WORKOUT TEMPLATES
    // ==========================================
    templates: {
        push: {
            name: "Push Day",
            description: "Chest, Shoulders, Triceps",
            exercises: [
                { id: 1, sets: 4, reps: "8-10" },   // Bench Press
                { id: 9, sets: 3, reps: "8-10" },   // Incline Barbell Press
                { id: 24, sets: 3, reps: "10-12" }, // Dumbbell Shoulder Press
                { id: 25, sets: 3, reps: "12-15" }, // Lateral Raise
                { id: 43, sets: 3, reps: "12-15" }, // Tricep Pushdown
                { id: 44, sets: 3, reps: "10-12" }  // Skull Crushers
            ]
        },
        pull: {
            name: "Pull Day",
            description: "Back, Biceps, Rear Delts",
            exercises: [
                { id: 11, sets: 4, reps: "5-6" },   // Deadlift
                { id: 12, sets: 4, reps: "6-10" },  // Pull-Up
                { id: 13, sets: 4, reps: "8-10" },  // Barbell Row
                { id: 19, sets: 3, reps: "15-20" }, // Face Pull
                { id: 33, sets: 3, reps: "10-12" }, // Barbell Curl
                { id: 35, sets: 3, reps: "10-12" }  // Hammer Curl
            ]
        },
        legs: {
            name: "Leg Day",
            description: "Quads, Hamstrings, Glutes, Calves",
            exercises: [
                { id: 53, sets: 4, reps: "6-8" },   // Barbell Squat
                { id: 21, sets: 3, reps: "8-10" },  // Romanian Deadlift
                { id: 54, sets: 3, reps: "10-12" }, // Leg Press
                { id: 56, sets: 3, reps: "10-12" }, // Leg Curl
                { id: 55, sets: 3, reps: "12-15" }, // Leg Extension
                { id: 61, sets: 4, reps: "12-15" }  // Calf Raise
            ]
        },
        upperBody: {
            name: "Upper Body",
            description: "Full upper body workout",
            exercises: [
                { id: 1, sets: 4, reps: "8-10" },   // Bench Press
                { id: 13, sets: 4, reps: "8-10" },  // Barbell Row
                { id: 23, sets: 3, reps: "8-10" },  // Overhead Press
                { id: 14, sets: 3, reps: "10-12" }, // Lat Pulldown
                { id: 33, sets: 3, reps: "10-12" }, // Barbell Curl
                { id: 43, sets: 3, reps: "12-15" }  // Tricep Pushdown
            ]
        },
        lowerBody: {
            name: "Lower Body",
            description: "Full lower body workout",
            exercises: [
                { id: 53, sets: 4, reps: "6-8" },   // Barbell Squat
                { id: 11, sets: 3, reps: "5-6" },   // Deadlift
                { id: 58, sets: 3, reps: "10-12" }, // Bulgarian Split Squat
                { id: 56, sets: 3, reps: "10-12" }, // Leg Curl
                { id: 60, sets: 3, reps: "10-12" }, // Hip Thrust
                { id: 61, sets: 4, reps: "15-20" }  // Calf Raise
            ]
        },
        fullBody: {
            name: "Full Body",
            description: "Complete full body workout",
            exercises: [
                { id: 53, sets: 3, reps: "8-10" },  // Barbell Squat
                { id: 1, sets: 3, reps: "8-10" },   // Bench Press
                { id: 13, sets: 3, reps: "8-10" },  // Barbell Row
                { id: 23, sets: 3, reps: "8-10" },  // Overhead Press
                { id: 33, sets: 2, reps: "10-12" }, // Barbell Curl
                { id: 69, sets: 3, reps: "30-60s" } // Plank
            ]
        }
    },

    // ==========================================
    // HELPER METHODS
    // ==========================================
    getExerciseById(id) {
        return this.exercises.find(ex => ex.id === id);
    },

    getExercisesByMuscle(muscle) {
        if (muscle === 'all') return this.exercises;
        return this.exercises.filter(ex => 
            ex.muscle === muscle || ex.secondaryMuscles.includes(muscle)
        );
    },

    getExercisesByEquipment(equipment) {
        if (equipment === 'all') return this.exercises;
        return this.exercises.filter(ex => ex.equipment === equipment);
    },

    searchExercises(query) {
        const lowerQuery = query.toLowerCase();
        return this.exercises.filter(ex => 
            ex.name.toLowerCase().includes(lowerQuery) ||
            ex.muscle.toLowerCase().includes(lowerQuery) ||
            ex.equipment.toLowerCase().includes(lowerQuery)
        );
    },

    getFilteredExercises(muscleFilter, equipmentFilter) {
        return this.exercises.filter(ex => {
            const muscleMatch = muscleFilter === 'all' || 
                ex.muscle === muscleFilter || 
                ex.secondaryMuscles.includes(muscleFilter);
            const equipmentMatch = equipmentFilter === 'all' || 
                ex.equipment === equipmentFilter;
            return muscleMatch && equipmentMatch;
        });
    },

    getMuscleIcon(muscle) {
        const icons = {
            chest: 'fa-heart-pulse',
            back: 'fa-arrows-to-dot',
            shoulders: 'fa-arrows-up-down',
            biceps: 'fa-hand-fist',
            triceps: 'fa-hand-back-fist',
            legs: 'fa-person-walking',
            core: 'fa-circle-dot',
            forearms: 'fa-hand'
        };
        return icons[muscle] || 'fa-dumbbell';
    },

        getEquipmentIcon(equipment) {
        const icons = {
            barbell: 'fa-dumbbell',
            dumbbell: 'fa-dumbbell',
            cable: 'fa-link',
            machine: 'fa-gears',
            bodyweight: 'fa-person'
        };
        return icons[equipment] || 'fa-dumbbell';
    },

    getDifficultyColor(difficulty) {
        const colors = {
            beginner: '#4ade80',
            intermediate: '#facc15',
            advanced: '#ef4444'
        };
        return colors[difficulty] || '#a0a0b0';
    },

    getRandomExercises(count = 5) {
        const shuffled = [...this.exercises].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    getExerciseCount() {
        return this.exercises.length;
    },

    getMuscleGroups() {
        return ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'forearms'];
    },

    getEquipmentTypes() {
        return ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'];
    }
};

// ==========================================
// USER DATA MANAGEMENT
// ==========================================
const UserData = {
    // Storage Keys
    KEYS: {
        WORKOUTS: 'lyfta_workouts',
        SETTINGS: 'lyfta_settings',
        STATS: 'lyfta_stats',
        ACTIVE_WORKOUT: 'lyfta_active_workout'
    },

    // Default Settings
    defaultSettings: {
        weightUnit: 'kg',
        restTimer: 90,
        notifications: true,
        hapticFeedback: true,
        memberSince: new Date().toISOString()
    },

    // Initialize user data
    init() {
        if (!this.getSettings()) {
            this.saveSettings(this.defaultSettings);
        }
        if (!this.getWorkouts()) {
            this.saveWorkouts([]);
        }
        if (!this.getStats()) {
            this.saveStats({
                totalWorkouts: 0,
                totalExercises: 0,
                totalVolume: 0,
                totalSets: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastWorkoutDate: null,
                muscleActivity: {
                    chest: 0,
                    back: 0,
                    shoulders: 0,
                    biceps: 0,
                    triceps: 0,
                    legs: 0,
                    core: 0,
                    forearms: 0
                },
                weeklyWorkouts: 0,
                weekStart: this.getWeekStart()
            });
        }
        this.checkWeekReset();
    },

    // Get week start date (Monday)
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).toDateString();
    },

    // Check if we need to reset weekly stats
    checkWeekReset() {
        const stats = this.getStats();
        const currentWeekStart = this.getWeekStart();
        
        if (stats.weekStart !== currentWeekStart) {
            stats.weeklyWorkouts = 0;
            stats.weekStart = currentWeekStart;
            // Reset weekly muscle activity
            Object.keys(stats.muscleActivity).forEach(muscle => {
                stats.muscleActivity[muscle] = 0;
            });
            this.saveStats(stats);
        }
    },

    // Settings Methods
    getSettings() {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : null;
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
    },

    // Workout Methods
    getWorkouts() {
        const workouts = localStorage.getItem(this.KEYS.WORKOUTS);
        return workouts ? JSON.parse(workouts) : null;
    },

    saveWorkouts(workouts) {
        localStorage.setItem(this.KEYS.WORKOUTS, JSON.stringify(workouts));
    },

    addWorkout(workout) {
        const workouts = this.getWorkouts();
        workout.id = Date.now();
        workout.date = new Date().toISOString();
        workouts.unshift(workout);
        this.saveWorkouts(workouts);
        this.updateStatsAfterWorkout(workout);
    
        // Sync to cloud if logged in
         if (typeof Auth !== 'undefined' && Auth.token) {
        Auth.saveWorkoutToCloud(workout);
    }
    
        return workout;
},

    getWorkoutById(id) {
        const workouts = this.getWorkouts();
        return workouts.find(w => w.id === id);
    },

    deleteWorkout(id) {
        let workouts = this.getWorkouts();
        workouts = workouts.filter(w => w.id !== id);
        this.saveWorkouts(workouts);
    },

    getRecentWorkouts(count = 5) {
        const workouts = this.getWorkouts();
        return workouts.slice(0, count);
    },

    // Active Workout Methods
    getActiveWorkout() {
        const workout = localStorage.getItem(this.KEYS.ACTIVE_WORKOUT);
        return workout ? JSON.parse(workout) : null;
    },

    saveActiveWorkout(workout) {
        localStorage.setItem(this.KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
    },

    clearActiveWorkout() {
        localStorage.removeItem(this.KEYS.ACTIVE_WORKOUT);
    },

    // Stats Methods
    getStats() {
        const stats = localStorage.getItem(this.KEYS.STATS);
        return stats ? JSON.parse(stats) : null;
    },

    saveStats(stats) {
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
    },

    updateStatsAfterWorkout(workout) {
        const stats = this.getStats();
        
        // Update totals
        stats.totalWorkouts++;
        stats.weeklyWorkouts++;
        
        let workoutVolume = 0;
        let workoutSets = 0;
        let exerciseCount = 0;
        
        // Calculate workout stats
        workout.exercises.forEach(exercise => {
            exerciseCount++;
            const exerciseData = ExerciseDatabase.getExerciseById(exercise.exerciseId);
            
            exercise.sets.forEach(set => {
                if (set.completed) {
                    workoutSets++;
                    const weight = parseFloat(set.weight) || 0;
                    const reps = parseInt(set.reps) || 0;
                    workoutVolume += weight * reps;
                    
                    // Update muscle activity
                    if (exerciseData) {
                        stats.muscleActivity[exerciseData.muscle] = 
                            (stats.muscleActivity[exerciseData.muscle] || 0) + 1;
                        
                        exerciseData.secondaryMuscles.forEach(muscle => {
                            stats.muscleActivity[muscle] = 
                                (stats.muscleActivity[muscle] || 0) + 0.5;
                        });
                    }
                }
            });
        });
        
        stats.totalExercises += exerciseCount;
        stats.totalSets += workoutSets;
        stats.totalVolume += workoutVolume;
        
        // Update streak
        const today = new Date().toDateString();
        const lastWorkout = stats.lastWorkoutDate ? new Date(stats.lastWorkoutDate).toDateString() : null;
        
        if (lastWorkout) {
            const lastDate = new Date(lastWorkout);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                stats.currentStreak++;
            } else if (diffDays > 1) {
                stats.currentStreak = 1;
            }
            // Same day doesn't change streak
        } else {
            stats.currentStreak = 1;
        }
        
        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }
        
        stats.lastWorkoutDate = new Date().toISOString();
        
        this.saveStats(stats);
    },

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.KEYS.WORKOUTS);
        localStorage.removeItem(this.KEYS.SETTINGS);
        localStorage.removeItem(this.KEYS.STATS);
        localStorage.removeItem(this.KEYS.ACTIVE_WORKOUT);
        this.init();
    },

    // Export data
    exportData() {
        return {
            workouts: this.getWorkouts(),
            settings: this.getSettings(),
            stats: this.getStats(),
            exportDate: new Date().toISOString()
        };
    },

    // Import data
    importData(data) {
        if (data.workouts) this.saveWorkouts(data.workouts);
        if (data.settings) this.saveSettings(data.settings);
        if (data.stats) this.saveStats(data.stats);
    },

    // Format helpers
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    formatVolume(volume) {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        }
        if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'k';
        }
        return volume.toString();
    },

    // Get muscle activity percentage for display
    getMuscleActivityPercentage(muscle) {
        const stats = this.getStats();
        if (!stats || !stats.muscleActivity) return 0;
        
        const maxActivity = Math.max(...Object.values(stats.muscleActivity), 1);
        const muscleValue = stats.muscleActivity[muscle] || 0;
        
        return Math.round((muscleValue / maxActivity) * 100);
    },

    // Get muscle activity level (for body map coloring)
    getMuscleActivityLevel(muscle) {
        const percentage = this.getMuscleActivityPercentage(muscle);
        
        if (percentage === 0) return 'inactive';
        if (percentage < 25) return 'light';
        if (percentage < 50) return 'medium';
        if (percentage < 75) return 'heavy';
        return 'intense';
    }
};

// Initialize UserData on load
document.addEventListener('DOMContentLoaded', () => {
    UserData.init();

});
