function author(user) {
    let name = `${user.globalName} (@${user.username})`;
    if (!user.globalName) {
        name = `${user.username}`;
    }
    return {
        name,
        icon_url: user.displayAvatarURL({ dynamic: true, size: 1024 })
    };
}

export { author }