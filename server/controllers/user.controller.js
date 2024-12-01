
export const signOut = (req, res) => {
    try {
        res.clearCookie("token");
    return res.status(200).json({
        message: "Signout successfully!",
    });    
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" }); 
    }
};
