const getEmailAttachments = async () => {

    async function loadFile(url: string) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to load file: ${url}`);
        }
        return Buffer.from(await res.arrayBuffer());
    }


    const files = [
        { filename: 'banner.webp', path: `https://mystic-vis.vercel.app/mail/banner.webp`, cid: 'banner' },
        { filename: 'footer-logo.png', path: `https://drive.google.com/thumbnail?id=1LVcwXkvMPqYORt3q6QXfsWKkl2UQ1ZYO&sz=w213`, cid: 'footer-logo' },
        { filename: 'footer-stripe.png', path: `https://drive.google.com/thumbnail?id=1LiRitz2urIoquVWYZuUG43K96S8VWBUF&sz=w1800`, cid: 'footer-stripe' },
        { filename: 'social-youtube.png', path: `https://drive.google.com/thumbnail?id=1oGPlT8j0l59kGgSxLZbSzKf16h6_IMFJ&sz=w1800`, cid: 'social-youtube' },
        { filename: 'social-whatsapp.png', path: `https://drive.google.com/thumbnail?id=1DMXrYayD657OPI3XDWGao7jf_E2NM73n&sz=w60`, cid: 'social-whatsapp' },
        { filename: 'social-tg.png', path: `https://drive.google.com/thumbnail?id=1cb8riyEQwMHhHxA8-odJu8iS-BP2_7K4&sz=w60`, cid: 'social-tg' },
        { filename: 'social-inst.png', path: `https://drive.google.com/thumbnail?id=1X_6K7Uh53NtlZpXqhgjRbenDCty4h4up&sz=w60`, cid: 'social-inst' },
        { filename: 'social-x.png', path: `https://drive.google.com/thumbnail?id=1JiJege40chcUpegMXvRJUr85up-tZJuX&sz=w60`, cid: 'social-x' }
    ]

    const attachments = await Promise.all(
        files.map(async (file) => ({
            filename: file.filename,
            content: await loadFile(file.path),
            cid: file.cid
        }))
    )

    return attachments;


}

export default getEmailAttachments;