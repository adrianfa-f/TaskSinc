const PasswordStrength = ({password}) => {
    const strength = {
        0: "Muy débil",
        1: "Débil",
        2: "Moderada",
        3: "Fuerte",
        4: "Muy fuerte"
    }

    const getColor = (strengthLevel) => {
        let color = ""
        switch(strengthLevel) {
            case 0:
                color = "bg-red-500";
                break
            case 1:
                color = "bg-orange-500";
                break
            case 2:
                color = "bg-yellow-500";
                break
            case 3:
                color = "bg-green-500";
                break
            case 4:
                color = "bg-blue-500"
                break
            default:
                break
        }
        return color;
    }

    const calcStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.match(/[A-Z]/) ) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;
        return Math.min(4, score)
    }

    const strengthLevel = calcStrength();

    return (
        <div className="mt-2">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i}
                        className={`h-2 w-1/5 rounded-full ${
                            i <= strengthLevel ? getColor(strengthLevel) : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
            <p className="text-xs mt-1 text-gray-500">
                {strength[strengthLevel]} • Mínimo 6 caracteres
            </p>
        </div>
    );
}

export default PasswordStrength;